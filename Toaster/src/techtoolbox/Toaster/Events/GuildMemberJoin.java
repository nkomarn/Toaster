package techtoolbox.Toaster.Events;

import java.util.concurrent.ThreadLocalRandom;

import net.dv8tion.jda.core.EmbedBuilder;
import net.dv8tion.jda.core.events.guild.member.GuildMemberJoinEvent;
import net.dv8tion.jda.core.hooks.ListenerAdapter;

public class GuildMemberJoin extends ListenerAdapter {
	
	String[] messages = {
			"[member] just joined. Everyone, look busy!",
			"A wild [member] appeared.",
			"Hello. Is it [member] you're looking for?",
			"Challenger approaching - A wild [member] has appeared!",
			"[member] slid into the server.",
			"Hey, [member]. We were expecting you ;)",
			"Never fear, [member] is here!",
			"Hold your beer, it's [member]!",
			"[member] has arrived. Party's over.",
			"Never gonna give [member] up, never gonna let [member] down.",
			"Swoooosh. [member] just landed."};
	
	public void onGuildMemberJoin(GuildMemberJoinEvent event) {
		int random = ThreadLocalRandom.current().nextInt(0, messages.length);
		
		EmbedBuilder join = new EmbedBuilder();
		join.setDescription(messages[random].replace("[member]", event.getMember().getAsMention()));
		join.setColor(0x42f498);
		join.setAuthor(event.getMember().getEffectiveName(), null, event.getMember().getUser().getAvatarUrl());
		event.getGuild().getTextChannelById("528733373200334878").sendMessage(join.build()).queue();
		join.clear();
	}
}
