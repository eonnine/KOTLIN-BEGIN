package com.hello.kotlin.user


import org.springframework.beans.factory.annotation.Autowired
import org.springframework.ui.Model
import org.springframework.ui.set
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/user")
class UserController {
	
	@Autowired lateinit var userService: UserService
	
	@GetMapping("/data/{id}")
	fun get(@PathVariable id: String): User {
		return userService.get(id)
	}
	
	@GetMapping("/datas")
	fun getList(model: Model): List<User> {
		return userService.getList()
	}
	
	@PostMapping("/data")
	fun join(@RequestBody param: User): Int {
		userService.join(param)
		return 1
	}
	
}