import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.HashMap;
import java.util.Map;


import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

public class XLevel1Classic {

    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(1337), 0);
        server.createContext("/", new WebHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("Server started on port 1337.");
    }

    static class WebHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange t) throws IOException {
            Map<String, String> param = queryToMap(t.getRequestURI().getQuery());

            if (!param.containsKey("q")) {
		        String response = "<h1>404 Not Found</h1>";
		        t.sendResponseHeaders(404, response.length()); // 상태 코드를 404로 설정
		        OutputStream os = t.getResponseBody();
		        os.write(response.getBytes());
		        os.close();
            } else {
		        // 'q' 파라미터가 있는 경우 정상 처리
		        String response = String.format("<h1>%s</h1>", param.get("q"));
		        t.sendResponseHeaders(200, response.length());
		        OutputStream os = t.getResponseBody();
		        os.write(response.getBytes());
		        os.close();
            }
        }

        public Map<String, String> queryToMap(String query) {
            if(query == null) {
                return null;
            }
            Map<String, String> result = new HashMap<>();
            for (String param : query.split("&")) {
                String[] entry = param.split("=");
                if (entry.length > 1) {
                    result.put(entry[0], entry[1]);
                }else{
                    result.put(entry[0], "");
                }
            }
            return result;
        }
    }
}
