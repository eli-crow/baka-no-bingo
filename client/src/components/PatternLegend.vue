<script setup lang="ts">
import PatternIcon from './PatternIcon.vue';
</script>

<template>
  <div class="PatternLegend">
    <div class="pattern">
      <PatternIcon class="pattern-icon" pattern-id="diagonal2" />
      <PatternIcon class="pattern-icon" pattern-id="row2" />
      <div class="pattern-score">20</div>
    </div>
    <div class="pattern">
      <PatternIcon class="pattern-icon" pattern-id="column1" />
      <PatternIcon class="pattern-icon" pattern-id="row1" />
      <div class="pattern-score">50</div>
    </div>
    <div class="pattern">
      <PatternIcon class="pattern-icon" pattern-id="x" />
      <PatternIcon class="pattern-icon" pattern-id="plus" />
      <div class="pattern-score">100</div>
    </div>
    <div class="pattern">
      <PatternIcon class="pattern-icon" pattern-id="all" />
      <div class="pattern-score">250</div>
    </div>
  </div>
</template>

<style scoped>
.PatternLegend {
  display: flex;
  height: 3.5rem;
  justify-content: space-between;
  padding: 0 1rem;
}

.pattern {
  display: flex;
  align-items: center;
}

.pattern-icon + .pattern-icon {
  margin-left: 0.5rem;
}

.pattern-score {
  padding-left: 0.5rem;
  font-weight: 700;
  color: var(--color-text-light);
}
</style>
