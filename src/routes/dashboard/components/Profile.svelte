<script>
    // Profile editing
  let isEditing = $state(false);
  let editedData = $state({ ...memberData });
  let {memberData} = $props();
  const handleProfileSave = () => {
    memberData.set(editedData);
    isEditing = false;
  };

</script>
<!-- Profile content -->
<div class="bg-white p-6 rounded-xl shadow-md">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold">Personal Information</h2>
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
              <select class="mt-1 input input-bordered w-full" bind:value={editedData[field.key]}>
                {#each field.options as option}
                  <option value={option}>{option}</option>
                {/each}
              </select>
            {:else}
              <input 
                type={field.type || 'text'}
                class="mt-1 input input-bordered w-full"
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
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {#each [{label: 'First Name', value: memberData.name},
                    {label: 'Last Name', value: memberData.surname},
                    {label: 'Date of Birth', value: moment(memberData.date_of_birth).format('MMMM D, YYYY')},
                    {label: 'Gender', value: memberData.gender},
                    {label: 'Qualification', value: memberData.qualification},
                    {label: 'Year of Study', value: memberData.year_of_study}] as field}
              <div>
                <h3 class="text-sm font-medium text-gray-500">{field.label}</h3>
                <p class="mt-1">{field.value}</p>
              </div>
            {/each}
          </div>
        {/if}
        </div>