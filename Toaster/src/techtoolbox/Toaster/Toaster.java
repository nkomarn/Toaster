package techtoolbox.Toaster;

import net.dv8tion.jda.core.AccountType;
import net.dv8tion.jda.core.JDA;
import net.dv8tion.jda.core.JDABuilder;
import net.dv8tion.jda.core.OnlineStatus;
import net.dv8tion.jda.core.entities.Game;
import techtoolbox.Toaster.Events.GuildMemberJoin;
import techtoolbox.Toaster.Events.GuildMessageReceived;

public class Toaster {
	public static JDA jda;
	public static String prefix = "~";
	
	public static void main(String[] args) throws Exception {
		jda = new JDABuilder(AccountType.BOT).setToken(Token.token).build();
		
		jda.getPresence().setGame(Game.playing("Minesweeper."));
		jda.getPresence().setStatus(OnlineStatus.ONLINE);
		
		jda.addEventListener(new Command());
		jda.addEventListener(new GuildMemberJoin());  
		jda.addEventListener(new GuildMessageReceived());
	}
}
