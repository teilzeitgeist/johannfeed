<template>
  <div v-if="events.length > 0" class="event-container">
    <transition-group
      name="list"
      :css="false"
      @enter="onEnter"
      @leave="onLeave"
    >
      <event
        v-for="(event, index) in visibleEvents"
        :key="event.guid"
        :event="event"
        :data-index="index"
        class="event"
      />
    </transition-group>
  </div>
  <div v-else>Nichts geladen</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import anime from "animejs";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import Event from "@/components/Event.vue";

let events = ref([]);
let visibleEvents = ref([]);
let init = ref(true);

// Initialer Index und Anzahl der Events pro Seite
const currentIndex = ref(0);
const eventsPerPage = ref(6);

onMounted(async () => {
  const { data } = await axios.get("http://localhost:5173/feed.xml");

  const xmlParser = new XMLParser();
  const { rss } = xmlParser.parse(data);

  events.value = rss.channel.item;

  updateVisibleEvents();
  // console.log("Events:", events.value);
  // Intervall zum automatischen Wechseln der Seite
  setInterval(nextPage, 10000); // Wechselt alle 10 Sekunden zur nächsten Seite
});

// Methode zum Aktualisieren der sichtbaren Events
const updateVisibleEvents = () => {
  visibleEvents.value = events.value.slice(
    currentIndex.value,
    currentIndex.value + eventsPerPage.value,
  );
  if (!init.value) visibleEvents.value = visibleEvents.value.slice().reverse();
};

// Methode zum Wechseln der Seite
const nextPage = () => {
  if (currentIndex.value + eventsPerPage.value >= events.value.length) {
    currentIndex.value = 0;
  } else {
    currentIndex.value += eventsPerPage.value;
  }
  init.value = false;
  updateVisibleEvents();
};

const onEnter = (el, done) => {
  anime({
    targets: el,
    opacity: [0, 1],
    translateX: [300, 0],
    duration: 1000,
    easing: "easeOutElastic",
    delay: el.dataset.index * 100, // build a custom delay based on the index
    complete: done,
  });
};

// called when the leave transition starts.
// use this to start the leaving animation.
const onLeave = (el, done) => {
  anime({
    targets: el,
    opacity: [1, 0],
    translateY: [0, 300],
    duration: 500,
    easing: "easeOutCubic",
    delay: (events.value.length - el.dataset.index) * 50, // reverse our custom delay
    complete: done,
  });
};
</script>

<style lang="scss">
.event-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-flow: row; /* Ensure items are placed row by row */
  padding: var(--space-lg);
  gap: var(--space-lg);
  position: relative;
  overflow: hidden;
}
</style>
