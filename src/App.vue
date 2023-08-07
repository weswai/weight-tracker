<script setup>
import { ref, shallowRef, computed, watch, nextTick } from 'vue'
import Chart from 'chart.js/auto';

// State for storing weight entries
const weights = ref([])

// References to the chart element and instance
const weightChartEl = ref(null)
const weightChart = shallowRef(null)

// State for the weight input field
const weightInput = ref(0.0)

// Computed property to get the most recent weight entry
const currentWeight = computed(() => {
  return weights.value.sort((a,b) => b.date - a.date)[0] || {weight: 0}
})

// Function to add a new weight entry
const addWeight = () => {
  weights.value.push({
    weight: weightInput.value,
    date: new Date().getTime()
  })
}

// Watcher to update the weight chart when weights change
watch(weights, (newWeights) => {
  const sortedWeights = [...newWeights].sort((a, b) => a.date - b.date);

  if (weightChart.value) {
    weightChart.value.data.labels = sortedWeights.map(weight => new Date(weight.date).toLocaleDateString()).slice(-7);
    weightChart.value.data.datasets[0].data = sortedWeights.map(weight => weight.weight).slice(-7);
    weightChart.value.update();
    return;
  }

  nextTick(() => {
    weightChart.value = new Chart(weightChartEl.value.getContext('2d'), {
      type: 'line',
      data: {
        labels: sortedWeights.map(weight => new Date(weight.date).toLocaleDateString()),
        datasets: [{
          label: 'Weight',
          data: sortedWeights.map(weight => weight.weight),
          backgroundColor: 'rgba(105, 255, 180, 0.2)',
          borderColor: 'rgba(105, 255, 180, 1)',
          borderWidth: 1,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  });
}, { deep: true });
</script>

<template>
  <!-- Main container -->
  <main>
    <h1>Weight Tracker</h1>

    <!-- Display current weight -->
    <div class="current">
      <span>{{ currentWeight.weight }}</span>
      <small> Current weight (kg)</small>     
    </div>

    <!-- Form to add new weight -->
    <form @submit.prevent="addWeight">
      <input type="number" step="0.1" v-model="weightInput" />
      <input type="submit" value="Add weight" />
    </form>

    <!-- Display weight chart and history if there are weight entries -->
    <div v-if="weights && weights.length > 0">
      <h2>Last 7 days</h2>

      <!-- Chart container -->
      <div class="canvas-box">
        <canvas ref="weightChartEl"></canvas>
      </div>

      <!-- Weight history list -->
      <div class="weight-history">
        <h2>Weight History</h2>
        <ul>
          <!-- Add key attribute to each list item -->
          <li v-for="weight in weights" :key="weight.date">
            <span>{{ weight.weight }}kg</span>
            <small>
              {{ new Date(weight.date).toLocaleDateString() }}
            </small>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>

<style scoped>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	font-family: 'montserrat', sans-serif;
}

body {
	background-color: #eee;
}

main {
	padding: 1.5rem;
}

h1 {
	font-size: 2em;
	text-align: center;
	margin-bottom: 2rem;
}

h2 {
	margin-bottom: 1rem;
	color: #888;
	font-weight: 400;
}

.current {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	width: 200px;
	height: 200px;
	
	text-align: center;
	background-color: white;
	border-radius: 999px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	border: 5px solid hwb(230 41% 0%);
	
	margin: 0 auto 2rem;
}

.current span {
	display: block;
	font-size: 2em;
	font-weight: bold;
	margin-bottom: 0.5rem;
}

.current small {
	color: #888;
	font-style: italic;
}

form {
	display: flex;
	margin-bottom: 2rem;
	border: 1px solid #AAA;
	border-radius: 0.5rem;
	overflow: hidden;
	transition: 200ms linear;
}

form:focus-within,
form:hover {
	border-color: rgb(105, 118, 255);
	border-width: 2px;
}

form input[type="number"] {
	appearance: none;
	outline: none;
	border: none;
	background-color: white;

	flex: 1 1 0%;
	padding: 1rem 1.5rem;
	font-size: 1.25rem;
}

form input[type="submit"] {
	appearance: none;
	outline: none;
	border: none;
	cursor: pointer;
	background-color: rgb(105, 118, 255);

	padding: 0.5rem 1rem;

	color: white;
	font-size: 1.25rem;
	font-weight: 700;
	transition: 200ms linear;
	border-left: 3px solid transparent;
}

form input[type="submit"]:hover {
	background-color: white;
	color: rgb(105, 118, 255);
	border-left-color: rgb(105, 118, 255);
}

.canvas-box {
	width: 100%;
	max-width: 720px;
	background-color: white;
	padding: 1rem;
	border-radius: 0.5rem;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	margin-bottom: 2rem;
}

.weight-history ul {
	list-style: none;
	padding: 0;
	margin: 0;
}

.weight-history ul li {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.5rem;
	cursor: pointer;
}

.weight-history ul li:nth-child(even) {
	background-color: #dfdfdf;
}

.weight-history ul li:hover {
	background-color: #f8f8f8;
}

.weight-history ul li:last-of-type {
	border-bottom: none;
}

.weight-history ul li span {
	display: block;
	font-size: 1.25rem;
	font-weight: 700;
	margin-right: 1rem;
}

.weight-history ul li small {
	color: #888;
	font-style: italic;
}
</style>
