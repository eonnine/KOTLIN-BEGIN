package com.hello.kotlin.main

import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.ui.set
import org.springframework.web.bind.annotation.GetMapping

@Controller
class IndexController {
	
	@GetMapping("/")
	fun goIndex() : String {
		return "index"
	}
	
	@GetMapping("/user/register")
	fun goUserRegister(): String {
		return "user/register"
	}
	
	@GetMapping("/user/list")
	fun goUserList(model: Model): String {
		model["title"] = "사용자 목록";
		model["subTitle"] = "목록";
		model["col1"] = "e-mail";
		model["col2"] = "사용자명";
		model["col3"] = "비밀번호";
		model["col4"] = "수정일자";
		return "user/list"
	}
	
}