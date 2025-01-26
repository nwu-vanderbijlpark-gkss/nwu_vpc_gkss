<script>
    import { onMount } from 'svelte';
    import moment from 'moment';
  
    let {data} = $props();
    let event = $state(data.event);
    
    let registrationCount = 0;
    let formData = {
      name: '',
      email: '',
      tickets: 1
    };
  
    let registrationSuccess = false;
    let registrationError = false;
  
    async function submitRegistration() {
      try {
        // Simulated registration logic
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            eventId: event.id,
            ...formData
          })
        });
  
        if (response.ok) {
          registrationSuccess = true;
          registrationCount += formData.tickets;
          
          // Reset form
          formData = {
            name: '',
            email: '',
            tickets: 1
          };
        } else {
          registrationError = true;
        }
      } catch (error) {
        registrationError = true;
      }
    }
  </script>
  <title>{event.topic} | NWU VAAL GKSS</title>
  <div class="container mx-auto px-4 py-8">
    <div class="grid md:grid-cols-2 gap-8 text-black">
      <!-- Event Details -->
      <div>
        <h1 class="text-4xl font-bold mb-4">{event.topic}</h1>
        <p class="text-gray-600 mb-4">{event.description}</p>
        
        <div class="bg-gray-100 p-4 rounded-lg mb-4">
          <div class="flex justify-between mb-2">
            <span class="font-semibold">Date:</span>
            <span>{moment(event.date).format('LLLL')}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold">Registered Attendees:</span>
            <span>{registrationCount}</span>
          </div>
        </div>
      </div>
  
      <!-- Registration Form -->
      <div id="register" class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-2xl font-semibold mb-4">Register for Event</h2>
        
        {#if registrationSuccess}
          <div class="alert alert-success mb-4">
            Registration successful! Thank you for registering.
          </div>
        {/if}
  
        {#if registrationError}
          <div class="alert alert-error mb-4">
            Registration failed. Please try again.
          </div>
        {/if}
  
        <form on:submit|preventDefault={submitRegistration}>
          <div class="mb-4">
            <label for="name" class="block mb-2">Full Name</label>
            <input
              type="text" 
              id="name" 
              bind:value={formData.name} 
              required 
              class="w-full px-3 py-2 border rounded-lg"
            >
          </div>
  
          <div class="mb-4">
            <label for="email" class="block mb-2">Email</label>
            <input 
              type="email" 
              id="email" 
              bind:value={formData.email} 
              required 
              class="w-full px-3 py-2 border rounded-lg"
            >
          </div>
          <button 
            type="submit" 
            class="btn btn-primary w-full text-white"
          >
            Register Now
          </button>
        </form>
      </div>
    </div>
  </div>