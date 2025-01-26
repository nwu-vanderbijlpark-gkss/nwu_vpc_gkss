<script>
    import { writable } from 'svelte/store';
    import moment from 'moment';
  
    let memberData = writable({
      name: "John Doe",
      yearOfStudy: "2nd Year",
      membershipStatus: "Active",
      eventsAttended: [
        { id: 1, name: "Event 1", date: "2024-08-10", feedback: "", rating: null },
        { id: 2, name: "Event 2", date: "2024-09-15", feedback: "", rating: null }
      ],
      points: 120,
      totalEventsRegistered: 5,
      totalEventsAttended: 2,
      ranking: 33
    });
  
    // Feedback & Rating Handler
    const submitFeedback = (eventId, feedback, rating) => {
      const updatedData = $memberData;
      const eventIndex = updatedData.eventsAttended.findIndex(event => event.id === eventId);
      if (eventIndex !== -1) {
        updatedData.eventsAttended[eventIndex].feedback = feedback;
        updatedData.eventsAttended[eventIndex].rating = rating;
      }
      memberData.set(updatedData);
    };
  </script>
  
  <div class="min-h-screen bg-gray-200 p-8">
    <!-- Header Section -->
    <h1 class="text-4xl font-extrabold text-center text-primary mb-12">Membership Dashboard</h1>
  
    <!-- Personal Profile Section -->
    <section class="bg-white p-8 rounded-xl shadow-md mb-12">
      <h2 class="text-3xl font-semibold text-gray-800 mb-6">Personal Profile</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label class="block text-gray-600">Name</label>
          <input type="text" class="input input-bordered w-full mt-2" bind:value={$memberData.name} />
        </div>
        <div>
          <label class="block text-gray-600">Year of Study</label>
          <input type="text" class="input input-bordered w-full mt-2" bind:value={$memberData.yearOfStudy} />
        </div>
        <div>
          <label class="block text-gray-600">Membership Status</label>
          <input type="text" class="input input-bordered w-full mt-2" bind:value={$memberData.membershipStatus} />
        </div>
      </div>
    </section>
  
    <!-- Event History Section -->
    <section class="bg-white p-8 rounded-xl shadow-md mb-12">
      <h2 class="text-3xl font-semibold text-gray-800 mb-6">Event History</h2>
      <div class="space-y-6">
        {#each $memberData.eventsAttended as event (event.id)}
          <div class="card bg-base-100 shadow-lg p-6 hover:shadow-xl transition-all">
            <div class="card-body">
              <h3 class="text-2xl font-semibold">{event.name}</h3>
              <p class="text-sm text-gray-500">{moment(event.date).format('MMM D, YYYY')}</p>
              <textarea 
                class="textarea textarea-bordered w-full mt-4" 
                bind:value={event.feedback} 
                placeholder="Add your feedback here..."></textarea>
              <div class="mt-4">
                <label class="block text-gray-600">Rating (1-5)</label>
                <input type="number" min="1" max="5" class="input input-bordered w-full mt-2" bind:value={event.rating} />
              </div>
              <button on:click={() => submitFeedback(event.id, event.feedback, event.rating)} class="btn btn-primary mt-6">Submit Feedback</button>
            </div>
          </div>
        {/each}
      </div>
    </section>
  
    <!-- Member Stats Section -->
    <section class="bg-white p-8 rounded-xl shadow-md mb-12">
      <h2 class="text-3xl font-semibold text-gray-800 mb-6">Member Stats</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Points -->
        <div class="card bg-neutral text-neutral-content p-6 text-center rounded-xl shadow-lg hover:shadow-xl transition-all">
          <div class="card-body">
            <h3 class="text-2xl font-semibold">Points</h3>
            <p class="text-4xl font-bold">{ $memberData.points }</p>
          </div>
        </div>
  
        <!-- Ranking -->
        <div class="card bg-teal-600 text-white p-6 text-center rounded-xl shadow-lg hover:shadow-xl transition-all">
          <div class="card-body">
            <h3 class="text-2xl font-semibold">Rank</h3>
            <p class="text-4xl font-bold">#{ $memberData.ranking }</p>
          </div>
        </div>
  
        <!-- Events Registered vs Attended -->
        <div class="card bg-green-600 text-white p-6 text-center rounded-xl shadow-lg hover:shadow-xl transition-all">
          <div class="card-body">
            <h3 class="text-2xl font-semibold">Event Stats</h3>
            <p class="text-xl">Registered: { $memberData.totalEventsRegistered }</p>
            <p class="text-xl">Attended: { $memberData.totalEventsAttended }</p>
          </div>
        </div>
      </div>
    </section>
  
    <!-- Member-Only Content Section -->
    <section class="bg-white p-8 rounded-xl shadow-md mb-12">
      <h2 class="text-3xl font-semibold text-gray-800 mb-6">Member-Only Content</h2>
      <p class="text-lg">Exclusive events and resources just for you!</p>
      <ul class="list-disc pl-6 mt-4 text-gray-600">
        <li>Exclusive Member Event: "Members Only Meetup" – Date: Oct 15, 2024</li>
        <li>Access to Premium Study Materials and Resources</li>
        <li>Special Discounts on Member Products and Services</li>
      </ul>
    </section>
  </div>
  
  <style>
    .card {
      @apply rounded-xl transition-all ease-in-out duration-300;
    }
  
    .card:hover {
      @apply transform scale-105;
    }
  
    .input,
    .textarea {
      @apply w-full mt-2 rounded-lg;
    }
  
    .btn {
      @apply px-6 py-3 rounded-full text-white font-semibold transition-colors duration-200;
    }
  
    
  </style>
  