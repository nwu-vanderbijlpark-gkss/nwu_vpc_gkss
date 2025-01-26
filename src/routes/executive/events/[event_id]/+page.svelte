<script>
    import { onMount } from 'svelte';
    import moment from 'moment';
  
    let {data} = $props();
    let event = $state(data.event);
    
    let registrationCount = 0;
  </script>
  <title>{event.topic} | NWU VAAL GKSS</title>
  <div class="container mx-auto px-4 py-8">
    <div class="grid md:grid-cols-2 gap-8 text-black">
      <!-- Event Details -->
      <div>
        <h1 class="text-4xl font-bold mb-4">{event.topic}</h1>
        <p class="text-gray-600 mb-4">{event.description}</p>
        
        <div class="bg-white shadow-md rounded-lg p-6">
          <div class="flex justify-between mb-2">
            <span class="font-semibold">Date:</span>
            <span>{moment(event.date).format('LLLL')}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold">Registered Attendees:</span>
            <span>{registrationCount}</span>
          </div>
          {#if moment().add(1,"hour").isAfter(moment(event.date))}
          <div class="flex justify-between">
            <span class="font-semibold">Actual Attendees:</span>
            <span>{registrationCount}</span>
          </div>
        {/if}
          
        </div>
      </div>
  
      <!-- Other stats -->
      <div id="register" class="bg-white shadow-md rounded-lg p-6">
        {#if moment().add(1,"hour").isAfter(moment(event.date))}
            yoh
        {/if}
        <input type="text" placeholder="Click to copy url" readonly class="input input-bordered w-full bg-gray-100"/> 
      </div>
    </div>
  </div>