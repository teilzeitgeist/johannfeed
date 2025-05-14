<template>
    <div :class="[{'event--longer': isLongEvent}, 'event', colorClass]">
        <div class="event__date" :class="[colorClass + '__date']">
            <span class="weekday">{{ weekday }}</span>
            <span class="day">{{ day }}</span>
            <span class="month">{{ month }}</span>
        </div>
        <div class="event__infos">
            <div class="event__title">
                {{ event.title }}
            </div>
            <div class="event__time">
                {{ parseTime() }}
            </div>
            <div class="event__place">
                <span v-html="parsePlace()"></span><br/>
                {{ parseStreet() }}
            </div>
        </div>
    </div>
</template>

<script lang="js" setup>
import {XMLParser} from "fast-xml-parser";
import dayjs from "dayjs";
import {ref} from "vue";

const props = defineProps(["event", "colorClass"]);

let meta = props.event.description.split("<br />");

let image = meta[4];

let isImage = image.length > 0;

let day = ref("");
let weekday = ref("");
let month = ref(dayjs(props.event.pubDate).format("MMM"));
let isLongEvent = ref(false);

const init = async () => {
    if (isImage) {
        const parsingOptions = {
            ignoreAttributes: false,
            attributeNamePrefix: "",
            stopNodes: ["*.pre", "*.script"],
            processEntities: true,
            htmlEntities: true,
        };
        const parser = new XMLParser(parsingOptions);
        image = await parser.parse(image);
    }
};

const parseTime = () => {
    let time = "";
    const timeSplit = meta[0].split("-");
    if (timeSplit && timeSplit.length > 1) {
        // Überspannendes Event
        if (timeSplit.length === 4) {
            isLongEvent.value = true;
            const firstDay = dayjs(timeSplit[0], ["D.MMMM YYYY"], "de");
            const firstWeekDay = firstDay.format('dd');
            const secondDay = dayjs(timeSplit[1], ["D.MMMM YYYY"], "de");
            const secondWeekDay = secondDay.format('dd');
            day.value = firstDay.date() + " – " + secondDay.date();
            weekday.value = firstWeekDay + " – " + secondWeekDay;

            if (!firstDay.isSame(secondDay, "month")) {
                month.value = firstDay.format("MMM") + " - " + secondDay.format("MMM");
            }
            time = timeSplit[2] + " – " + timeSplit[3];
        } else {
            day.value = dayjs(props.event.pubDate).date().toString();
            weekday.value = dayjs(props.event.pubDate).format('dd');
            time = timeSplit[1] + " – " + timeSplit[2];
        }
    }
    return time;
};

const parsePlace = () => {
    return meta[1];
};

const parseStreet = () => {
    return meta[2];
};

/*const parseImage = () => {
  let image = meta[5];
  return image.length > 0 ? image.src : "";
};*/

const parseCategories = () => {
    const parser = new DOMParser();
    let parsedHtml = parser.parseFromString(meta[4], "text/html");
    let items = parsedHtml.querySelectorAll("ul li a");
    let categories = [];
    items.forEach((item) => {
        let category = item.href.split("categories/")[1];
        if (category && category.length > 0) {
            category = category.split("/")[0];
            if (category && category.length > 0 && !categories.includes(category)) {
                categories.push(category);
            }
        }
    });
    return categories;
};

init();
</script>

<style lang="scss">
@import "src/scss/_mixins";
@import "src/scss/_variables";
.event {
    display: flex;
    background-color: white;
    align-items: stretch;
    border: 4px solid #932c87;
    border-radius: var(--space-lg);
    padding: var(--space-lg);
    gap: var(--space-xl);
}

.event img {
    max-height: 500px;
}

.event__date {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 14rem;
    line-height: 1.2;
    background-color: #932c87;
    color: white;
    border-radius: var(--space-lg);

    .day {
        font-size: 250%;
        font-weight: 700;
    }

    .month {
        font-size: 200%;
    }
}

.event--longer .event__date .month {
    font-size: 140%;
}

.event__infos {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    width: 100%;
    font-size: 100%;
}

.event__title {
    font-weight: 700;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}

.event__time {
    font-weight: 700;
}

.event__place {
    font-size: 100%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
}

$colors: (
    "slide-1": $c3000,
    "slide-2": $c4000,
    "slide-3": $c5000,
    "slide-4": $c6000,
    "slide-5": $c7000
);

// Dynamisch Klassen erzeugen
@each $name, $color in $colors {
    .event--#{$name} {
        border-color: $color; // Rahmenfarbe
    }

    .event--#{$name}__date {
        background-color: $color; // Hintergrundfarbe für das Datum
        color: white; // Textfarbe für Kontrast
    }
}

.event--slide-3__date, .event--slide-4__date, .event--slide-5__date {
    color: black;
}

@include between($fullhd, $fourk) {
    .event__date {
    }
    .event__infos {
        gap: var(--space-sm);
    }
}

@include from($fourk) {
    .event {
        border-radius: var(--space-xxl);
    }
    .event__date {
        min-width: 24rem;
        border-radius: var(--space-xxl);
    }
    .event__infos {
        gap: var(--space-xl);
        padding-left: var(--space-xxl);
    }
}
</style>
