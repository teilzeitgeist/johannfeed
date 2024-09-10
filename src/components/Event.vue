<template>
    <div :class="[{'event--longer': isLongEvent}, getCategoryColor()]">
        <div class="event__date">
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
                {{ parsePlace() }}<br/>
                {{ parseStreet() }}
                <!--{{ parseCategories() }}-->
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {XMLParser} from "fast-xml-parser";
import dayjs from "dayjs";
import {ref} from "vue";

const props = defineProps(["event"]);

const categoryColors = [
    {
        category: "begegnung",
        color: "meeting",
    },
    {
        category: "nachbarschaftshilfe",
        color: "help",
    },
    {
        category: "kurs",
        color: "course",
    },
    {
        category: "beratung",
        color: "consulting",
    },
    {
        category: "sport-spiel",
        color: "game",
    },
    {
        category: "jugendangebot",
        color: "youth",
    },
    {
        category: "kinderangebot",
        color: "kids",
    },
    {
        category: "stadtteilspaziergang",
        color: "walk",
    },
];

let meta = props.event.description.split("<br />");

let image = meta[4];

let isImage = image.length > 0;

let day = ref("");
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
            const secondDay = dayjs(timeSplit[1], ["D.MMMM YYYY"], "de");
            day.value = firstDay.date() + "–" + secondDay.date();

            if (!firstDay.isSame(secondDay, "month")) {
                month.value = firstDay.format("MMM") + "-" + secondDay.format("MMM");
            }
            time = timeSplit[2] + " – " + timeSplit[3];
        } else {
            day.value = dayjs(props.event.pubDate).date().toString();
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
    items.forEach((item: HTMLAnchorElement) => {
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

const getCategoryColor = () => {
    const categories = parseCategories();
    const cat = categoryColors.find((cat) => categories.includes(cat.category));
    return cat ? cat.color : "";
};

init();
</script>

<style lang="scss">
.event {
    display: flex;
    gap: var(--space-lg);
    background-color: var(--c2000);
    padding: var(--space-xl);
    align-items: center;

    &.help {
        background-color: var(--c4000);
    }

    &.course {
        background-color: var(--c4100);
    }

    &.meeting {
        background-color: var(--c5000);
    }

    &.consulting {
        background-color: var(--c5100);
    }

    &.walk {
        background-color: var(--c7000);
    }

    &.game {
        background-color: var(--c7100);
    }

    &.youth {
        background-color: var(--c6000);
    }

    &.kids {
        background-color: var(--c6100);
    }
}

.event img {
    max-height: 500px;
}

.event__date {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 11rem;
    border-radius: var(--space-xs) 0 0 var(--space-xs);
    padding: var(--space-md);

    .day {
        font-size: var(--fs-xl);
        font-weight: 700;
    }

    .month {
        font-size: var(--fs-lg);
    }
}

.event__infos {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    padding: var(--space-md) 0;
}

.event__title {
    font-weight: 700;
}

.event__time {
    font-weight: 500;
}
</style>
