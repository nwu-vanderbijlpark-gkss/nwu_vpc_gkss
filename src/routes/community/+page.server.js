import { redirect } from '@sveltejs/kit';

export const actions = {
	addTopic: async ({ locals: { supabase }, request }) => {
		const {
			data: { user }
		} = await supabase.auth.getUser();
		const { data: member, error } = await supabase.from('member').select().eq('id', user.id);
		if (error || !member[0].interests) {
			if (!member[0].interests) {
				redirect(303, '/onboarding');
			}
			console.error(error);
		} else {
			//making a post
			const formData = await request.formData();
			const images = formData.getAll('files[]');
			const { data, error } = await supabase
				.from('topic')
				.insert({
					topic: formData.get('topic'),
					content: formData.get('content'),
					tags: formData.get('tags'),
					author_id: user.id,
					author_username: member.username
				})
				.select();

			if (error) {
				console.error(error);
			} else {
				const topic_id = data[0].id;
				for (const image of images) {
					let d;
					if (image instanceof File) {
						const file_url = `images/topic_images/${Date.now()}_${image.name}`;
						const { data, error } = await supabase.storage.from('files').upload(file_url, image);
						if (error) {
							console.error(error);
						} else {
							//insert image record into the topic_images table
							const { error } = await supabase.from('topic_images').insert({
								topic_id: topic_id,
								image: file_url
							});
						}
					}
				}
				//award the member with 20 points
				const { data: member } = await supabase.from('member').select('points').eq('id', user.id);
				let newPts = Number(member[0].points) + 20;
				await supabase.from('member').update({ points: newPts }).eq('id', user.id);
				redirect(303, `/community/topic/${topic_id}`);
			}
		}
	},
	deletetopic: async ({ request, locals: { supabase } }) => {
		const data = await request.formData();
		const id = data.get('id');
		//get the images and delete them also
		const { data: topic_images } = await supabase.from('topic_images').select().eq('topic_id', id);
		const images = [];
		if (topic_images.length > 0) {
			for (const image of topic_images) {
				images.push(image.image);
			}
			//delete the images
			const { error } = await supabase.storage.from('files').remove(images);
			if (error) {
				console.error(error);
			}
		}

		const { error } = await supabase.from('topic').delete().eq('id', id);
		if (error) {
			console.error(error);
		}
	}
};
