package com.dev.HiddenBath.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.dev.HiddenBath.model.order.FlapOrder;
import com.dev.HiddenBath.model.order.LowOrder;
import com.dev.HiddenBath.model.order.MirrorOrder;
import com.dev.HiddenBath.model.order.SlideOrder;
import com.dev.HiddenBath.model.order.TopOrder;
import com.dev.HiddenBath.service.ClientService;

@Controller
@RequestMapping("/order")
public class OrderController {

	@Autowired
	ClientService clientService;
	
	@GetMapping({"", "/"})
	public String mirrorHome() {
		
		return "front/order/mirror/index";
	}
	
	@GetMapping("/information")
	public String mirrorInformation() {
		
		return "front/order/mirror/information";
	}
		
	@GetMapping("/top")
	public String topHome() {
		
		return "front/order/top/index";
	}
	
	@GetMapping("/low")
	public String lowHome() {
		
		return "front/order/low/index";
	}
	
	@GetMapping("/flap")
	public String flapHome() {
		
		return "front/order/flap/index";
	}
	
	@GetMapping("/slide")
	public String slideHome() {
		
		return "front/order/slide/index";
	}
	
	@PostMapping("/mirrorOrderInsert")
	@ResponseBody
	public String mirrorOrderInsert(MirrorOrder client) {
		
		clientService.clientInsert(client);
		
		StringBuffer sb = new StringBuffer();
		String msg = "문의 주셔서 감사합니다. 빠르게 연락드리도록 하겠습니다.";
		
		sb.append("alert('" + msg + "');");
		sb.append("location.href='/index'");
		sb.append("</script>");
		sb.insert(0, "<script>");
		
		return sb.toString();
	}
	
	@PostMapping("/lowOrderInsert")
	@ResponseBody
	public String lowOrderInsert(LowOrder client) {
		
		clientService.clientInsert(client);
		
		StringBuffer sb = new StringBuffer();
		String msg = "문의 주셔서 감사합니다. 빠르게 연락드리도록 하겠습니다.";
		
		sb.append("alert('" + msg + "');");
		sb.append("location.href='/index'");
		sb.append("</script>");
		sb.insert(0, "<script>");
		
		return sb.toString();
	}
	
	@PostMapping("/topOrderInsert")
	@ResponseBody
	public String topOrderInsert(TopOrder client) {
		
		clientService.clientInsert(client);
		
		StringBuffer sb = new StringBuffer();
		String msg = "문의 주셔서 감사합니다. 빠르게 연락드리도록 하겠습니다.";
		
		sb.append("alert('" + msg + "');");
		sb.append("location.href='/index'");
		sb.append("</script>");
		sb.insert(0, "<script>");
		
		return sb.toString();
	}
	
	@PostMapping("/slideOrderInsert")
	@ResponseBody
	public String slideOrderInsert(SlideOrder client) {
		
		clientService.clientInsert(client);
		
		StringBuffer sb = new StringBuffer();
		String msg = "문의 주셔서 감사합니다. 빠르게 연락드리도록 하겠습니다.";
		
		sb.append("alert('" + msg + "');");
		sb.append("location.href='/index'");
		sb.append("</script>");
		sb.insert(0, "<script>");
		
		return sb.toString();
	}
	
	@PostMapping("/flapOrderInsert")
	@ResponseBody
	public String flapOrderInsert(FlapOrder client) {
		
		clientService.clientInsert(client);
		
		StringBuffer sb = new StringBuffer();
		String msg = "문의 주셔서 감사합니다. 빠르게 연락드리도록 하겠습니다.";
		
		sb.append("alert('" + msg + "');");
		sb.append("location.href='/index'");
		sb.append("</script>");
		sb.insert(0, "<script>");
		
		return sb.toString();
	}
}
