package com.dev.HiddenBath.controller;

import org.apache.commons.codec.EncoderException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailSendException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.dev.HiddenBath.service.EmailService;
import com.dev.HiddenBath.service.SMSService;

@Controller
public class TestController {

	@Autowired
	EmailService emailService;

	@Autowired
	SMSService smsService;

//	@GetMapping("/test")
//	public String test() {
//
//		return "front/test";
//	}

//	@GetMapping("/sessionDelete")
//	public String sessionDelete(HttpServletRequest request) {
//		HttpSession session = request.getSession();
//		session.invalidate();
//		return "front/index";
//	}
	
//	@GetMapping("/pdfDownLoad")
//	@ResponseBody
//	public String pdfDownLoad(HttpServletRequest request, HttpServletResponse response) throws IOException {
//
//		ExecutorService service = Executors.newSingleThreadExecutor();
//		service.submit(() -> {
//			String strUrl = "https://hidden3661.cafe24.com/site/catalog/2023.pdf";
//			try {
//				URL url = new URL(strUrl);
//				InputStream in = url.openStream();
//				Files.copy(in, Paths.get("2023.pdf"), StandardCopyOption.REPLACE_EXISTING);
//				File pdf = new File("2023.pdf");
//				response.setContentType("application/pdf");
//				response.addHeader("Content-Disposition", "attachment; filename=2023.pdf");
//				response.setContentLength((int) pdf.length());
//
//				FileInputStream fileInputStream = new FileInputStream(pdf);
//				OutputStream responseOutputStream = response.getOutputStream();
//				int bytes;
//				while ((bytes = fileInputStream.read()) != -1) {
//					responseOutputStream.write(bytes);
//				}
//
//			} catch (IOException e) {
//				System.out.println(e);
//			}
//		});
//		service.submit(() -> {
//			File pdf = new File("2023.pdf");
//			pdf.delete();
//		});
//		service.shutdown();
//		return "success";
//	}

	@GetMapping("/emailTest")
	@ResponseBody
	public String emailTest() throws MailSendException, InterruptedException {
		String[] address = { "teriwoo48@gmail.com" };
		String message = "안녕하세요 히든바스 입니다." + "\r\n"
				+ "오늘도 저희 히든바스에 방문해 주셔 진심으로 감사드립니다. 고객님의 문의가 접수 되었으며, 빠른 시간 내에 확인하여 담당자가 연락 드리도록 하겠습니다." + "\r\n"
				+ "궁금하신 점이 있으신 경우 본 이메일 혹은 하단의 고객센터를 통해 문의 해 주시기 바랍니다." + "\r\n" + "=========================\r\n"
				+ "[히든바스 SMS 방문하기]\r\n" + "▼ INSTAGRAM\r\n" + "https://www.instagram.com\r\n" + "▼ FACEBOOK\r\n"
				+ "https://www.facebook.com\r\n" + "=========================\r\n" + "고객센터 : \r\n" + "주소 : \r\n"
				+ "FAX : \r\n";
		emailService.sendEmails(address, "이메일 테스트", message);
		return "success";
	}

	@GetMapping("/smsTest")
	@ResponseBody
	public String smsTest() throws EncoderException {
		smsService.sendMessage("01038943849", "고객 문의가 발생하였습니다.");

		return "success";
	}

}
