export const handler = async (req) => {
    const { next_run } = await req.json()
    try {
        const url = 'https://nwu-vaal-gkss.netlify.app/community/api/getLeaderBoard';

        const response = await fetch(url);
  
      if (!response.success) throw new Error("Keep-alive failed");
      
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Supabase kept alive successfully" })
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }
  };