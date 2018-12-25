package techtoolbox.Toaster;

import net.dv8tion.jda.core.AccountType;
import net.dv8tion.jda.core.JDA;
import net.dv8tion.jda.core.JDABuilder;
import net.dv8tion.jda.core.OnlineStatus;
import net.dv8tion.jda.core.entities.Game;
import techtoolbox.Toaster.Token;

public class Main {
	private static JDA jda;
	
	public static void main(String[] args) throws Exception {
		jda = new JDABuilder(AccountType.BOT).setToken(Token.token).buildAsync();
		
		// Bot presence
		jda.getPresence().setGame(Game.listening("to sizzling toast."));
		jda.getPresence().setStatus(OnlineStatus.DO_NOT_DISTURB);
	}
}
