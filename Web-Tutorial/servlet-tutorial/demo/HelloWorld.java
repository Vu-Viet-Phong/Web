import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.Servlet;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
 
/**
 * This servlet program is used to print "Hello World" on 
 * client browser by implementing servlet interface.
 */
 
public class HelloWorld implements Servlet {
    private static final long serialVersionUID = 1L;
 
    public HelloWorld() {}
 
    ServletConfig config=null;
 
    @Override
    public void init(ServletConfig config) throws ServletException {
    	this.config = config;
    	System.out.println("Do initialization here.");		
    }
 
    @Override
    public void destroy() {
	    System.out.println("Do clean-up process here.");
    }
 
    @Override
    public ServletConfig getServletConfig() {
       	return config;
    }
 
    @Override
    public String getServletInfo() {
	    return "w3spoint.com";
    }
 
    @Override
    public void service(ServletRequest request, ServletResponse response)
		                                throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
            out.println("<h1>Hello World example using " + "servlet interface.</h1>");
            out.close();		
    }
}