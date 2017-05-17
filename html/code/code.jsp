<%@ page language="java" pageEncoding="utf-8"%>
<%@ page import="java.awt.*,java.awt.image.*,java.awt.geom.*,java.util.*,javax.imageio.*" %>
<%!
	Color getRandColor(int min,int max){   //随机产生指定区域内的RGB颜色
		Random random1=new Random();
		if(min>=255)min=255;
		if(max>=255)max=255;
		int r=min+random1.nextInt(max-min);
		int g=min+random1.nextInt(max-min);
		int b=min+random1.nextInt(max-min);
		return new Color(r,g,b);
	}
 %>
 <%
 	//禁止页面缓冲
 	response.setHeader("Pragma","No-cache");
	response.setHeader("Cache-Control","no-cache");
	response.setDateHeader("Expires",0);
	//在缓存中创建图形对象，然后输出
	int width=80,height=42;  //输出图片的大小
	BufferedImage buff=new BufferedImage(width,height,BufferedImage.TYPE_INT_RGB);  //指定缓冲的图片和颜色结构
	Graphics2D g=(Graphics2D)buff.getGraphics();
	Random rand=new Random();
	//背景色,200-250色段
	g.setColor(getRandColor(200,250));
	g.fillRect(0,0,width,height);
	//设置字体
	g.setFont(new Font("Times New Roman",Font.PLAIN, 22));
	//画出30条随机干扰线，160-200色段
	g.setColor(getRandColor(160,200));  //在循环外面干扰线颜色一样
	for(int i=1;i<=30;i++){
		int x=rand.nextInt(width);  //线条的起始位置
		int y=rand.nextInt(height);
		int tx=rand.nextInt(12);
		int ty=rand.nextInt(12);
		g.drawLine(x,y,x+tx,y+ty);
	}
	
	//画出2条随机干扰线，20-140色段
	g.setColor(getRandColor(20,140));
	for(int i=1;i<=2;i++){
		int x=rand.nextInt(10);  //线条的起始位置
		int y=rand.nextInt(height);
		int tx=rand.nextInt(10);
		int ty=rand.nextInt(height);
		g.drawLine(x,y,width-tx,ty);
	}
	
	//随机产生4个验证码
	String coding="";  //保存得到的验证码字符串
	char str[] = {'1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','j','k','l','m','n','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z'};      
	for(int i=0;i<4;i++){
		int temp=rand.nextInt(56);  //0-9的数字
		
		String tempCode=String.valueOf(str[temp]);
		coding+=tempCode;
		//显示验证码,20-140色段
		g.setColor(getRandColor(20,140));
		//设置每个字符的随机旋转 
		AffineTransform at = new AffineTransform();
		int number = rand.nextInt(3)-1;
		double role = number*rand.nextDouble()*(Math.PI/4);
		at.setToRotation(role,13*i+10,25); //role:旋转角度,后面两个参数是设置围绕坐标点旋转
		g.setTransform(at);
		g.drawString(tempCode,13*i+10,25);
	}
	//System.out.println(coding);
	
	//信息存入session
	session.setAttribute("validcode",coding.toUpperCase());
	//图象生成，显示到页面
	g.dispose();
	ServletOutputStream sos=response.getOutputStream();
	ImageIO.write(buff,"jpeg",sos);
	sos.flush();  //强行将缓冲区的内容输入到页面
	sos.close();
	sos=null;
	response.flushBuffer();
	out.clear();
	out=pageContext.pushBody(); 
  %>
