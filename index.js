// Change require to dynamic import
import('telegraf').then(({ Telegraf }) => {
    // Import fetch function from node-fetch
    import('node-fetch').then(({ default: fetch }) => {
        const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

        bot.command('imagine', async (ctx) => {
            try {
                // Extract the query from the message
                const commandIndex = ctx.message.text.indexOf('/imagine');
                const query = ctx.message.text.slice(commandIndex + '/imagine'.length).trim();

                // Reply with the query to verify
                ctx.reply(`Query: ${query}`);

                // Make a GET request to Lexica's search API based on the query
                const response = await fetch(`https://lexica.art/api/v1/search?q=${encodeURIComponent(query)}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data from Lexica Art API');
                }
                const data = await response.json();

                // Choose a random image from the response
                if (!data.images || data.images.length === 0) {
                    throw new Error('No images found for the query');
                }
                const randomImage = data.images[Math.floor(Math.random() * data.images.length)];

                // Reply with the random image without a caption
                ctx.replyWithPhoto(randomImage.src);
            } catch (error) {
                console.error('Error fetching or processing data:', error);
                ctx.reply('Sorry, an error occurred while fetching art.');
            }
        });

        bot.launch().catch(error => {
            console.error('Error launching bot:', error);
        });
    }).catch(error => {
        console.error('Error importing node-fetch:', error);
    });
}).catch(error => {
    console.error('Error importing Telegraf:', error);
});
