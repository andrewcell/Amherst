
package tools;
/**
  * Mysql Utilities
  *        
  * @author Ralph Ritoch <rritoch@gmail.com>
  * @copyright Ralph Ritoch 2011 ALL RIGHTS RESERVED
  * @link http://www.vnetpublishing.com
  *
  */
 
 
 public class MYSQLUtil {
     
     /**
      * Escape string to protected against SQL Injection
      *
      * You must add a single quote ' around the result of this function for data,
      * or a backtick ` around table and row identifiers. 
      * If this function returns null than the result should be changed
      * to "NULL" without any quote or backtick.
      *
      * @param link
      * @param str
      * @return
      * @throws Exception 
      */
     
     public static String mysql_real_escape_string(java.sql.Connection link, String str) 
           throws Exception
     {
         if (str == null) {
             return null;
         }
                                     
         if (str.replaceAll("[a-zA-Z0-9_!@#$%^&*()-=+~.;:,\\Q[\\E\\Q]\\E<>{}\\/? ]","").length() < 1) {
             return str;
         }
             
         String clean_string = str;
         clean_string = clean_string.replaceAll("\\\\", "\\\\\\\\");
         clean_string = clean_string.replaceAll("\\n","\\\\n");
         clean_string = clean_string.replaceAll("\\r", "\\\\r");
         clean_string = clean_string.replaceAll("\\t", "\\\\t");
         clean_string = clean_string.replaceAll("\\00", "\\\\0");
         clean_string = clean_string.replaceAll("'", "\\\\'");
         clean_string = clean_string.replaceAll("\\\"", "\\\\\"");
                                                             
         if (clean_string.replaceAll("[a-zA-Z0-9_!@#$%^&*()-=+~.;:,\\Q[\\E\\Q]\\E<>{}\\/?\\\\\"' ]"
           ,"").length() < 1) 
         {
             return clean_string;
         }
                             
         java.sql.Statement stmt = link.createStatement();
         String qry = "SELECT QUOTE('"+clean_string+"')";
             
         stmt.executeQuery(qry);
         java.sql.ResultSet resultSet = stmt.getResultSet();
         resultSet.first();
         String r = resultSet.getString(1);
         return r.substring(1,r.length() - 1);       
     }
     
     /**
      * Escape data to protected against SQL Injection
      *
      * @param link
      * @param str
      * @return
      * @throws Exception 
      */
     
     public static String quote(java.sql.Connection link, String str)
           throws Exception
     {
         if (str == null) {
             return "NULL";
         }
         return "'"+mysql_real_escape_string(link,str)+"'";
     }
     
     /**
      * Escape identifier to protected against SQL Injection
      *
      * @param link
      * @param str
      * @return
      * @throws Exception 
      */
     
     public static String nameQuote(java.sql.Connection link, String str)
           throws Exception
     {
         if (str == null) {
             return "NULL";
         }
         return "`"+mysql_real_escape_string(link,str)+"`";
     }
     
 }
