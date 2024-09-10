<template>
    <div v-if="events.length > 0" class="event-container">
        <!-- Flicking-Komponente mit AutoPlay und Animationen -->
        <Flicking
            v-if="chunkedEvents.length > 0"
            :options="{ defaultIndex: 0, duration: 400, align: 'prev', overflow: true, circular: true }"
            :plugins="plugins"
            @moveStart="onMove"
        >
        <div v-for="(chunk, i) in chunkedEvents" class="panels" :key="i">
            <div class="grid-container">
                <event
                    v-for="(event, index) in chunk"
                    :key="event.guid"
                    :event="event"
                    :data-index="index"
                    class="event panel"
                />
            </div>
        </div>
        </Flicking>
    </div>
    <div v-else class="empty">
        <div class="text">Wird geladen</div>
        <div class="loading-spinner"></div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, nextTick } from "vue";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import Event from "@/components/Event.vue";
import Flicking from "@egjs/vue3-flicking";
import { AutoPlay, Perspective } from "@egjs/flicking-plugins";

// AutoPlay-Plugin für den Slider
const plugins = [new AutoPlay({ duration: 15000, direction: "NEXT", stopOnHover: false }), new Perspective({ rotate: -1, scale: 2, perspective: 600 })];

let events = ref([]);

onMounted(async () => {
    //const { data } = await axios.get("http://localhost:5173/feed.xml");
    const { data } = await axios.get("https://www.johannstadt.de/events/feed");

    const xmlParser = new XMLParser();
    const { rss } = xmlParser.parse(data);

    events.value = rss.channel.item;

    // Warten, bis die Panels gerendert sind, und dann Animationen starten
    await nextTick();
});

// Funktion zum Auslösen der Animationen bei Slide-Ende
const onMove = async (event) => {
    event.currentTarget.panels.forEach((el) => {
        el.element.querySelectorAll('.panel').forEach((e) => {
            e.animate({
                opacity: [0, 1],
                transform: ["scaleX(0) scaleY(0) translateX(200px)", "scaleX(1) scaleY(1) translateX(0)"],
            }, {
                duration: Math.ceil(Math.random() * (600 - 400) + 400),
                direction: 'normal',
                fill: 'both',
                easing: 'ease-in-out'
            });
        })
    });
    await nextTick();
};


const chunkedEvents = computed(() => {
    const chunkSize = 6;
    const chunks: Event[][] = [];
    for (let i = 0; i < events.value.length; i += chunkSize) {
        chunks.push(events.value.slice(i, i + chunkSize));
    }
    return chunks;
});
</script>

<style lang="scss">
.flicking-viewport {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.flicking-camera {
    display: flex;
    flex-direction: row;
}

.panels {
    display: flex;
    flex: 0 0 100%; /* Füllt den ganzen Slide */
    justify-content: center;
    align-items: center;
}

/* Kachel-Design innerhalb eines Panels */
.grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-flow: row;
    position: relative;
    overflow: hidden;
    height: 100dvh;
    width: 100%;
}

.empty {
    margin: var(--space-xxl);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100dvh;
    .text {
        margin-bottom: var(--space-lg);
        font-weight: 700;
        font-size: var(--fs-lg);
    }
}
</style>
