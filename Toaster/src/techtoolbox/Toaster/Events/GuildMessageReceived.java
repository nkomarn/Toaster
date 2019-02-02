package techtoolbox.Toaster.Events;

import net.dv8tion.jda.core.EmbedBuilder;
import net.dv8tion.jda.core.events.message.guild.GuildMessageReceivedEvent;
import net.dv8tion.jda.core.hooks.ListenerAdapter;
import techtoolbox.Toaster.Rank;
import techtoolbox.Toaster.Toaster;

public class GuildMessageReceived extends ListenerAdapter {
	public void onGuildMessageReceived(GuildMessageReceivedEvent event) {
		String[] args = event.getMessage().getContentRaw().split("\\s+");
		
		if (args[0].equalsIgnoreCase(Toaster.prefix + "rank")) {
			Rank rank = new Rank();
			event.getChannel().sendMessage(String.valueOf(rank.getRank(event.getMember()))).queue();
		}
		else if (args[0].equalsIgnoreCase(Toaster.prefix + "giveaway")) {
			if (event.getMember().isOwner()) {
				
				// Delete command message
				event.getMessage().delete().queue();
				
				String desc = "";
				
				for (int i = 1; i < args.length - 1; i++) {
					desc += args[i] + " ";
				}
				
				EmbedBuilder embed = new EmbedBuilder();
				embed.setColor(0xf44171);
				embed.setTitle("🎉 Hey look, a giveaway!");
				embed.setDescription("Click the party popper emoji down below to enter!");
				embed.addField("Giving away:", desc, true);
				embed.setImage(args[args.length - 1]);
				
				event.getChannel().sendMessage(embed.build()).queue((message) -> {
					message.addReaction("🎉").queue();
				});
				
				// TODO Check for args at some point later
			}
		}
	}
}
