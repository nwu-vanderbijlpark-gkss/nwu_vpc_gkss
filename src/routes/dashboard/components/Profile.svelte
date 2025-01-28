<script>
	import moment from "moment";
	import { slide } from "svelte/transition";

    // Profile editing
  let isEditing = $state(false);
  let editedData = $state({ ...memberData });
  let {memberData} = $props();
  let member = $state(memberData);
  const handleProfileSave = () => {
    member = editedData;
    isEditing = false;
  };

</script>
<!-- Profile content -->
<div transition:slide class="bg-white p-6 rounded-xl shadow-md">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-base-100">Personal Information</h2>
      {#if !isEditing}
        <button class="btn btn-primary" onclick={() => isEditing = true}>Edit Profile</button>
      {/if}
    </div>

    {#if isEditing}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each [{label: 'First Name', key: 'name'}, 
                {label: 'Last Name', key: 'surname'},
                {label: 'Date of Birth', key: 'date_of_birth', type: 'date'},
                {label: 'Gender', key: 'gender', type: 'select', options: ['Male', 'Female', 'Other']},
                {label: 'Qualification', key: 'qualification'},
                {label: 'Year of Study', key: 'year_of_study', type: 'select', 
                 options: ['1st', '2nd', '3rd', '4th']}] as field}
          <div>
            <label class="block text-sm font-medium text-gray-700">{field.label}</label>
            {#if field.type === 'select'}
              <select class="mt-1 input input-bordered w-full bg-gray-200" bind:value={editedData[field.key]}>
                {#each field.options as option}
                  <option value={option}>{option}</option>
                {/each}
              </select>
            {:else}
              <input 
                type={field.type || 'text'}
                class="mt-1 input input-bordered w-full bg-gray-200"
                bind:value={editedData[field.key]}
              />
            {/if}
          </div>
        {/each}
        
        <div class="md:col-span-2 flex justify-end space-x-4">
          <button class="btn btn-outline-primary" onclick={() => isEditing = false}>Cancel</button>
          <button class="btn btn-primary" onclick={handleProfileSave}>Save Changes</button>
        </div>
      </div>
      {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-base-200">
            {#each [{label: 'First Name', value: member.name},
                    {label: 'Last Name', value: member.surname},
                    {label: 'Date of Birth', value: moment(member.date_of_birth).format('MMMM D, YYYY')},
                    {label: 'Gender', value: member.gender},
                    {label: 'Qualification', value: member.qualification},
                    {label: 'Year of Study', value: member.year_of_study}] as field}
              <div>
                <h3 class="text-sm font-medium text-gray-500">{field.label}</h3>
                <p class="mt-1">{field.value}</p>
              </div>
            {/each}
          </div>
        {/if}
        </div>