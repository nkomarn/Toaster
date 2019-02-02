package techtoolbox.Toaster.Events;

import net.dv8tion.jda.core.events.message.guild.GuildMessageReceivedEvent;
import net.dv8tion.jda.core.hooks.ListenerAdapter;

public class Message extends ListenerAdapter {
	public void onGuildMessageReceived(GuildMessageReceivedEvent event) {
		/*if (!event.getMember().getUser().isBot()) {
			try {
				Class.forName("com.mysql.jdbc.Driver");
				Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/toaster", "root", "");
				Statement statement = connection.createStatement();
				ResultSet rank = statement.executeQuery("SELECT `messages` FROM `ranks` WHERE `user`=" + event.getMember().getUser().getId());
			
				if (!rank.next()) {
					System.out.println("no");
				}
				else {
					while (rank.next()) {
						
					}
				}
			}
			catch (Exception e) {
				e.printStackTrace();
			}
		}
		else {
			System.out.println("User is bot; ignoring.");
		} */
	}
}
