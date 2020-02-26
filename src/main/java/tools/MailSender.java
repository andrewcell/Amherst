/*
 * Copyright (C) 2013 Nemesis Maple Story Online Server Program

 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package tools;

import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.Properties;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

/**
 *
 * @author Eternal
 */
public class MailSender {

    // 환경 설정 변수
    private String contentType = "text/html";
    private String charSet = "UTF-8";
    final String username = "ID@gmail.com";
    final String password = "PASSWORD";

    public void send(String from, String to, String name, String subjectz, String content) {
        try {
            // SMTP 설정
            Properties props = System.getProperties();
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.smtp.host", "smtp.gmail.com");
            props.put("mail.smtp.port", "587");

            // Session, MimeMessage 생성
            Session sess = Session.getInstance(props,
		  new javax.mail.Authenticator() {
                        @Override
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(username, password);
			}
		  });
            
            
            MimeMessage msg = new MimeMessage(sess);

            // 보낸 시간
            msg.setSentDate(new Date());

            // 발신자
            msg.setFrom(new InternetAddress(username, name, "UTF-8"));

            // 수신자
            msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));

            // 제목
            msg.setSubject(subjectz, charSet);

            // 내용
            msg.setContent(content, "text/html; charset=UTF-8");

            // 헤더
            msg.setHeader("Content-Type", contentType);

            // 전송
            Transport.send(msg);
        } catch (AddressException ae) {
            System.out.println("[Error : " + ae.getMessage() + "]");
            ae.printStackTrace(System.err);
        } catch (MessagingException me) {
            System.out.println("[Error : " + me.getMessage() + "]");
            me.printStackTrace(System.err);
        } catch (UnsupportedEncodingException ue) {
            System.out.println("[Error : " + ue.getMessage() + "]");
            ue.printStackTrace(System.err);
        }
    }
}
