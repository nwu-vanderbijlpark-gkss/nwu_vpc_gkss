<script>
	import { slide } from "svelte/transition";

    const pages = ["personal", "academic", "interests"];
    let page = $state(1);
    let form = $state({ 
        name: "", surname: "", date_of_birth: "", gender: "",
        qualification: "", student_no: "", year_of_study: "",
        interests: [],
        customInterest: ""
    });

    // Predefined IT interests
    const predefinedInterests = [
        "Web Development",
        "Mobile Development",
        "Artificial Intelligence",
        "Data Science",
        "Cybersecurity",
        "Cloud Computing",
        "DevOps",
        "UI/UX Design",
        "Game Development",
        "Blockchain",
        "Internet of Things",
        "Machine Learning"
    ];

    // Calculate progress percentage
    let progress = $state((page / pages.length) * 100);

    const isAtLeast15 = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            return age - 1 >= 15;
        }
        return age >= 15;
    };

    const validatePersonalInfo = () => {
        const errors = [];
        if (!form.name) errors.push("Name is required");
        if (!form.surname) errors.push("Surname is required");
        if (!form.date_of_birth) errors.push("Date of birth is required");
        if (!form.gender) errors.push("Gender is required");
        if (form.date_of_birth && !isAtLeast15(form.date_of_birth)) {
            errors.push("You must be at least 15 years old to register");
        }
        return errors;
    };

    const validateAcademicInfo = () => {
        const errors = [];
        if (!form.qualification) errors.push("Qualification is required");
        if (!form.student_no) errors.push("Student number is required");
        if (!form.year_of_study) errors.push("Year of study is required");
        if (!/^\d{8}$/.test(form.student_no)) {
            errors.push("Student number must be exactly 8 digits");
        }
        return errors;
    };

    const validateInterests = () => {
        const errors = [];
        if (form.interests.length === 0) {
            errors.push("Please select at least one interest");
        }
        return errors;
    };

    const toggleInterest = (interest) => {
        if (form.interests.includes(interest)) {
            form.interests = form.interests.filter(i => i !== interest);
        } else {
            form.interests = [...form.interests, interest];
        }
    };

    const addCustomInterest = () => {
        if (form.customInterest.trim()) {
            if (!form.interests.includes(form.customInterest.trim())) {
                form.interests = [...form.interests, form.customInterest.trim()];
            }
            form.customInterest = "";
        }
    };

    const removeInterest = (interest) => {
        form.interests = form.interests.filter(i => i !== interest);
    };

    const handleNav = async(type, event) => {
        event.preventDefault();
        let errors = [];

        if (type === "next") {
            if (page === 1) {
                errors = validatePersonalInfo();
            } else if (page === 2) {
                errors = validateAcademicInfo();
            } else if (page === 3) {
                errors = validateInterests();
            }

            if (errors.length > 0) {
                const errorList = errors.join('\n• ');
                alert('Please correct the following:\n• ' + errorList);
                return;
            }
            if(page === 3 ){
                // Create and submit FormData
                const formData = new FormData();
                //append the form data as json string, parse in server 
                formData.append('form', JSON.stringify(form));

                try {
                    const response = await fetch('/onboarding', {
                        method: 'POST',
                        body: formData
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const result = await response.json();
                    if (result.type == "success") {
                        alert('Registration successful!');
                        // will be redirected from the server
                        window.location.pathname = "/dashboard";
                    } else {
                        window.location.pathname = "/dashboard";
                    }
                } catch (error) {
                    console.error('Submission error:', error);
                    alert('Failed to submit form. Please try again.');
                }
                
            }else{
                page++;
            }
        } else {
            page--;
        }
        progress = (page / pages.length) * 100;
        window.location.hash = pages[page - 1];
    }
</script>
<title>Onboarding | {pages[page-1]}</title>


<div class="flex w-full min-h-screen bg-[#0c0c0c] justify-center items-center p-5">
    <div class="bg-base-200 rounded-xl p-5 w-full max-w-xl">
        <!-- Progress bar -->
        <div class="w-full bg-gray-700 rounded-full h-2.5 mb-6">
            <div class="bg-primary h-2.5 rounded-full transition-all duration-300" style="width: {progress}%"></div>
        </div>

        <h1 class="text-xl font-bold flex items-center gap-2">
            <span class="text-primary">Step {page}</span> 
            <span class="text-gray-400">of {pages.length}</span>
        </h1>
        <p class="text-gray-400 mt-2 mb-6">You can always edit this info in your profile</p>

        <form use:enhance method="post" class="flex w-full flex-col gap-5">
            {#if page === 1}
                <div class="space-y-6" transition:slide>
                    <h2 class="text-lg font-bold flex items-center gap-2">
                        Personal Information
                        <span class="text-xs text-gray-400">(All fields required)</span>
                    </h2>
                    
                    <label class="form-control w-full">
                        <p class="mb-2">Name</p>
                        <input
                            type="text"
                            name="name"
                            class="input input-bordered w-full"
                            class:input-error={!form.name}
                            placeholder="Enter your name"
                            bind:value={form.name}
                            required
                        />
                    </label>

                    <label class="form-control w-full">
                        <p class="mb-2">Surname</p>
                        <input
                            type="text"
                            name="surname"
                            class="input input-bordered w-full"
                            class:input-error={!form.surname}
                            placeholder="Enter your surname"
                            bind:value={form.surname}
                            required
                        />
                    </label>

                    <label class="form-control w-full">
                        <p class="mb-2">Date Of Birth</p>
                        <input
                            type="date"
                            name="date_of_birth"
                            class="input input-bordered w-full"
                            class:input-error={!form.date_of_birth}
                            bind:value={form.date_of_birth}
                            required
                        />
                        {#if form.date_of_birth && !isAtLeast15(form.date_of_birth)}
                            <p class="text-error text-sm mt-1">You must be at least 15 years old to register</p>
                        {/if}
                    </label>

                    <label class="form-control w-full">
                        <p class="mb-2">Gender</p>
                        <select
                            name="gender"
                            class="select select-bordered w-full"
                            class:select-error={!form.gender}
                            bind:value={form.gender}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </label>
                </div>
            {:else if page === 2}
                <div class="space-y-6" transition:slide>
                    <h2 class="text-lg font-bold flex items-center gap-2">
                        Academic Information
                        <span class="text-xs text-gray-400">(All fields required)</span>
                    </h2>

                    <label class="form-control w-full">
                        <p class="mb-2">Qualification</p>
                        <input
                            type="text"
                            name="qualification"
                            class="input input-bordered w-full"
                            class:input-error={!form.qualification}
                            placeholder="e.g Bsc Information Technology"
                            bind:value={form.qualification}
                            required
                        />
                    </label>

                    <label class="form-control w-full">
                        <p class="mb-2">Student Number</p>
                        <input
                            type="number"
                            name="student_no"
                            class="input input-bordered w-full"
                            class:input-error={!form.student_no || !/^\d{8}$/.test(form.student_no)}
                            placeholder="Enter your 8-digit student number"
                            bind:value={form.student_no}
                            required
                        />
                        {#if form.student_no && !/^\d{8}$/.test(form.student_no)}
                            <p class="text-error text-sm mt-1">Student number must be exactly 8 digits</p>
                        {/if}
                    </label>

                    <label class="form-control w-full">
                        <p class="mb-2">Year Of Study</p>
                        <select
                            name="year_of_study"
                            class="select select-bordered w-full"
                            class:select-error={!form.year_of_study}
                            bind:value={form.year_of_study}
                            required
                        >
                            <option value="">Select Year of Study</option>
                            <option value="1st">1st Year</option>
                            <option value="2nd">2nd Year</option>
                            <option value="3rd">3rd Year</option>
                            <option value="4th">4th Year</option>
                            <option value="4th+">4th+ Year</option>
                        </select>
                    </label>
                </div>
            {:else if page === 3}
                <div class="space-y-6" transition:slide>
                    <h2 class="text-lg font-bold flex items-center gap-2">
                        IT Interests
                        <span class="text-xs text-gray-400">(Select at least one)</span>
                    </h2>

                    <!-- Selected interests tags -->
                    {#if form.interests.length > 0}
                        <div class="flex flex-wrap gap-2 mb-4">
                            {#each form.interests as interest}
                                <div class="badge badge-primary gap-2">
                                    {interest}
                                    <button type="button" class="btn btn-ghost btn-xs" onclick={() => removeInterest(interest)}>×</button>
                                </div>
                            {/each}
                        </div>
                    {/if}

                    <!-- Custom interest input -->
                    <div class="flex gap-2">
                        <input
                            type="text"
                            class="input input-bordered flex-1"
                            placeholder="Add your own interest"
                            bind:value={form.customInterest}
                            onkeypress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomInterest())}
                        />
                        <button 
                            type="button"
                            class="btn btn-primary"
                            onclick={addCustomInterest}
                            disabled={!form.customInterest.trim()}
                        >
                            Add
                        </button>
                    </div>

                    <!-- Predefined interests -->
                    <div class="grid grid-cols-2 gap-2 mt-4">
                        {#each predefinedInterests as interest}
                            <button
                                type="button"
                                class="btn btn-outline btn-sm"
                                class:btn-primary={form.interests.includes(interest)}
                                onclick={() => toggleInterest(interest)}
                            >
                                {interest}
                            </button>
                        {/each}
                    </div>
                </div>
            {/if}

            <div class="flex flex-col gap-3 mt-6">
                <div class="flex gap-3">
                    {#if page > 1}
                        <button 
                            type="button" 
                            onclick={(event) => handleNav("back", event)} 
                            class="btn btn-secondary flex-1"
                        >
                            Previous
                        </button>
                    {/if}
                    <button 
                        type="submit" 
                        onclick={(event) => handleNav("next", event)} 
                        class="btn btn-primary text-white flex-1"
                    >
                        {page === pages.length ? 'Submit' : 'Next'}
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>