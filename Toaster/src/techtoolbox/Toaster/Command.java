package techtoolbox.Toaster;

import net.dv8tion.jda.core.events.message.guild.GuildMessageReceivedEvent;
import net.dv8tion.jda.core.hooks.ListenerAdapter;

public class Command extends ListenerAdapter {
	public void onGuildMessageReceived(GuildMessageReceivedEvent event) {
		/*String[] args = event.getMessage().getContentRaw().split(" ");

			if (args[0].equalsIgnoreCase("~rank")) {
				try {
					Class.forName("com.mysql.jdbc.Driver");
					Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/toaster", "root", "");
					Statement statement = connection.createStatement();
					ResultSet rank = statement.executeQuery("SELECT * FROM `ranks` WHERE `user`=" + event.getMember().getUser().getId());
				
					if (!rank.next()) {
						System.out.println("No users in DB");
					}
					else {
						rank = statement.executeQuery("SELECT * FROM `ranks` WHERE `user`=" + event.getMember().getUser().getId());
						
						while (rank.next()) {
							EmbedBuilder xp = new EmbedBuilder();
							xp.setDescription("Current XP: " + rank.getString("xp"));
							event.getChannel().sendMessage(xp.build()).queue();
							System.out.println("ran loop");
						}
					}
				}
				catch (Exception e) {
					e.printStackTrace();
				}
			} */
        }
}
