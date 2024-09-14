<template>
    <div :class="[{'event--longer': isLongEvent}]">
        <div class="event__date" :class="getCategoryColor()">
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

<script lang="js" setup>
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
            day.value = firstDay.date() + " – " + secondDay.date();

            if (!firstDay.isSame(secondDay, "month")) {
                month.value = firstDay.format("MMM") + " - " + secondDay.format("MMM");
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

const getCategoryColor = () => {
    const categories = parseCategories();
    const cat = categoryColors.find((cat) => categories.includes(cat.category));
    return cat ? cat.color : "none";
};

init();
</script>

<style lang="scss">
.event {
    display: flex;
    margin: var(--space-xl);
    align-items: center;
    box-shadow: 0 0 42px -32px rgba(0, 0, 0, 0.45);
}

.event img {
    max-height: 500px;
}

.event__date {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 18rem;
    height: 100%;
    background-color: #FFF;
    border-radius: var(--space-xs) 0 0 var(--space-xs);
    box-shadow: 4px 0 0 0 rgba(0, 0, 0, 0.08);

    .day {
        font-size: var(--fs-xxl);
        font-weight: 700;
    }

    .month {
        font-size: var(--fs-lg);
    }
}

.event__infos {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    padding: var(--space-md) var(--space-xl);
    background-color: rgba(255,255,255,0.65);
    border-radius: 0 var(--space-xs) var(--space-xs) 0;
    height: 100%;
    width: 100%;
}

.event__title {
    font-weight: 700;
}

.event__time {
    font-weight: 500;
}
</style>
