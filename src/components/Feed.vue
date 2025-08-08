<template>
    <div v-if="events.length > 0" class="event-container">
        <!-- Flicking-Komponente mit AutoPlay und Animationen -->
        <Flicking
            v-if="chunkedEvents.length > 0"
            :options="{ defaultIndex: 0, duration: 400, align: 'prev', circular: true, horizontal: true, adaptive: true, resizeOnContentsReady: true}"
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
                        :colorClass="`event--slide-${(i % 5) + 1}`"
                    />
                    <div class="more-infos">
                        <img src="@/assets/qr-johannstadt.svg">
                        <div class="more-infos__text">
                            <span class="label">Das ganze Viertel auf</span>
                            <span class="url">www.johannstadt.de</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Neuer Slide für Instagram Feed -->
            <div class="panels panels--instagram" :key="'instagram-slide'">
                <div class="instagram-container">
                    <div class="more-infos">
                        <img src="@/assets/johannstadt.de_qr.svg" class="instagram-code" alt="QR-Code zu instagram.com/johannstadt.de">
                        <div class="more-infos__text">
                            <span class="label">Folgt uns auch auf Instagram</span>
                            <span class="url">instagram.com/johannstadt.de</span>
                        </div>
                    </div>
                    <InstagramFeed
                        :count="3"
                        :accessToken="INSTAGRAM_TOKEN"
                    />
                </div>
            </div>
        </Flicking>
    </div>
    <div v-else class="empty">
        <div class="text"><span v-if="!isError">Wird geladen</span><span v-else>Leider ist beim Laden ein Fehler aufgetreten. Wir kümmern uns bestimmt bereits darum ;-)</span></div>
        <div class="more-infos" v-if="isError">
            <img src="@/assets/qr-johannstadt.svg">
            <div class="more-infos__text">
                <span class="label">Das ganze Viertel auf</span>
                <span class="url">www.johannstadt.de</span>
            </div>
        </div>
        <div class="loading-spinner" v-if="!isError"></div>
    </div>
</template>

<script lang="js" setup>
import { ref, onMounted, computed, nextTick } from "vue";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import Event from "@/components/Event.vue";
import Flicking from "@egjs/vue3-flicking";
import { AutoPlay, Perspective } from "@egjs/flicking-plugins";

// AutoPlay-Plugin für den Slider
const plugins = [new AutoPlay({ duration: 30000, direction: "NEXT", stopOnHover: false }), new Perspective({ rotate: -1, scale: 2})];

let events = ref([]);
const isError = ref(false);

const INSTAGRAM_TOKEN = "IGAANKOrzPAP1BZAFAyaDlyS0daRERDRWt3RlhEVVhraEFMXzVqaVk0VFhlWTJ0LUo4OGJHRkk1Y0d1OUJmaVczMmxrY2g3LWRWX29JSnR2T0JmMHRRbGZA3ZAmUxN2N5dEgtb18zSWxxME1yY1FjcW9mT29nNGNxSTRSLWZANZA0lsRQZDZD";

onMounted(async () => {
    // Dynamische Ableitung der Basis-URL
    const baseURL = `${window.location.protocol}//${window.location.hostname}`;
    const feedURL = `${baseURL}/events/feed`;
    const MAX_EVENTS = 15;

    try {
        //const { data } = await axios.get("http://localhost:5173/feedapp/feed3.xml");
        const { data } = await axios.get(feedURL);
        const xmlParser = new XMLParser();
        const { rss } = xmlParser.parse(data);

        events.value = parseItemsForVisibility(rss.channel.item).slice(0, MAX_EVENTS);

        // Warten, bis die Panels gerendert sind, und dann Animationen starten
        await nextTick();
    }

    catch (e) {
        isError.value = true;
        console.log(e);
    }
});

const parseItemsForVisibility = (items) => {
    // filter liefert ein neues Array zurück, in dem nur die gewünschten Items bleiben
    return items.filter(item => {
        const visibility = item.description?.split('<br />')[6] ?? '';
        return visibility === 'Ja' || visibility === 'Keine Angabe';
    });
};

// Funktion zum Auslösen der Animationen bei Slide-Ende
const onMove = async (event) => {
    event.currentTarget.panels.forEach((el) => {
        el.element.querySelectorAll('.panel').forEach((e) => {
            e.animate({
                opacity: [0, 1],
                transform: ["scaleX(0) scaleY(0) translateX(3.5rem)", "scaleX(1) scaleY(1) translateX(0)"],
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
    const chunkSize = 5;
    const chunks = [];
    for (let i = 0; i < events.value.length; i += chunkSize) {
        chunks.push(events.value.slice(i, i + chunkSize));
    }
    return chunks;
});
</script>

<style lang="scss">
@import "src/scss/_mixins";
@import "src/scss/_variables";
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
    align-items: flex-start;
    &.panels--instagram {
        .more-infos {
            width: 100%;
            justify-content: center;
            height: 30%;
            padding: 0;
        }

        .instagram-wrapper {
            max-width: 100%;
            height: 70%;
            padding: 0;
        }
    }
}

.instagram-container {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    padding: var(--space-lg);
}

/* Kachel-Design innerhalb eines Panels */
.grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    grid-gap: var(--space-lg);
    padding: var(--space-lg);
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
        font-size: 100%;
    }
}

.more-infos {
    display: flex;
    align-items: center;
    padding: 0 var(--space-xl);
    font-size: 200%;
    img {
        margin-right: 4rem;
        height: 70%;
        border-radius: var(--space-xs);
    }
    .more-infos__text {
        display: flex;
        flex-direction: column;
        .label {
            font-size: 100%;
        }
        .url {
            font-size: 100%;
            font-weight: 700;
        }
    }
}

@include from($fourk) {
    .instagram-container, .grid-container {
        padding: var(--space-xxl);
        grid-gap: var(--space-xxl);
    }
}
</style>
