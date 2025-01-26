<script>
    // This member can view stats and charts

    import { slide } from "svelte/transition";
    import moment from "moment";
    let { data } = $props();
    console.log(data);
</script>

<div class="p-6 lg:max-h-[85svh] overflow-auto">
    <h1 class="text-4xl font-extrabold text-center text-primary mb-10">Admin Dashboard</h1>

    <!-- Stats Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Members Card -->
        <div class="card bg-primary text-white shadow-xl transition-all transform hover:scale-105">
            <div class="card-body">
                <h2 class="text-5xl font-bold">{data.members.length}</h2>
                <p class="text-lg">Total Members</p>
            </div>
        </div>

        <!-- Events Card -->
        <div class="card bg-secondary text-white shadow-xl transition-all transform hover:scale-105">
            <div class="card-body">
                <h2 class="text-5xl font-bold">{data.events.length}</h2>
                <p class="text-lg">Total Events</p>
            </div>
        </div>

        <!-- Upcoming Events Card -->
        <div class="card bg-info text-white shadow-xl transition-all transform hover:scale-105">
            <div class="card-body">
                <h2 class="text-5xl font-bold">
                    {data.events.filter(event => moment(event.date).isAfter(moment())).length}
                </h2>
                <p class="text-lg">Upcoming Events</p>
            </div>
        </div>

        <!-- Past Events Card -->
        <div class="card bg-error text-white shadow-xl transition-all transform hover:scale-105">
            <div class="card-body">
                <h2 class="text-5xl font-bold">
                    {data.events.filter(event => moment(event.date).isBefore(moment())).length}
                </h2>
                <p class="text-lg">Past Events</p>
            </div>
        </div>
    </div>

    <!-- Placeholder for future charts and graphs -->
    <div class="mt-12">
        <h2 class="text-2xl font-bold text-center text-primary mb-6">Analytics</h2>

        <!-- Placeholder for charts and visual stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Example Chart 1 -->
            <div class="card bg-base-200 shadow-lg">
                <div class="card-body">
                    <h3 class="text-xl font-semibold">Chart 1</h3>
                    <div class="h-64 bg-gray-200 rounded-lg"></div> <!-- Placeholder for chart -->
                </div>
            </div>

            <!-- Example Chart 2 -->
            <div class="card bg-base-200 shadow-lg">
                <div class="card-body">
                    <h3 class="text-xl font-semibold">Chart 2</h3>
                    <div class="h-64 bg-gray-200 rounded-lg"></div> <!-- Placeholder for chart -->
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .card {
        @apply rounded-xl p-6 flex items-center justify-center transition-all duration-300;
    }

    .bg-primary {
        @apply bg-blue-600;
    }

    .bg-secondary {
        @apply bg-green-600;
    }

    .bg-accent {
        @apply bg-yellow-600;
    }

    .bg-info {
        @apply bg-teal-600;
    }

    .bg-error {
        @apply bg-red-600;
    }

    .btn {
        @apply px-6 py-3 rounded-full text-white font-semibold transition-colors;
    }

    .btn-primary {
        @apply bg-blue-600 hover:bg-blue-700;
    }

    .btn-secondary {
        @apply bg-green-600 hover:bg-green-700;
    }
</style>
