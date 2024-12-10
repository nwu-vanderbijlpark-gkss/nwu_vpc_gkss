<div id="contact" class="py-20 bg-[#0c0c0c] p-5 flex flex-col justify-center items-center space-y-5">
    <h1 class="text-white text-xl font-bold">Contact Us</h1>
    <form method="post" action="#" class="flex flex-col w-full lg:w-2/4 gap-5 ">
        <label class="form-control w-full">
            <p>Name</p>
            <input type="text" name="name" class="input input-bordered" id="name" placeholder="First name"/>
        </label>
        <label class="form-control w-full">
            <p>Surname</p>
            <input type="text" name="surname" class="input input-bordered" id="surname" placeholder="Your surname"/>
        </label>
        <label class="form-control w-full">
            <p>Email Address</p>
            <input type="email" name="email" class="input input-bordered" id="email" placeholder="name12@domain.com"/>
        </label>
        <label class="form-control w-full">
            <p>Message</p>
            <textarea name="message" class="textarea textarea-bordered" id="message" placeholder="How may we assist?"></textarea>
        </label>
        <button type="submit" class="btn btn-primary text-white">Send Message</button>
    </form>
</div>