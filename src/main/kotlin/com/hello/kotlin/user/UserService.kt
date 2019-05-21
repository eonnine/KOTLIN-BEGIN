package com.hello.kotlin.user

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class UserService {
	
	@Autowired lateinit var userRepository: UserRepository
	
	fun get(id: String): User {
		return userRepository.findByUserEmail(id);
	}
		
	fun getList(): List<User> {
		return userRepository.findAll();
	}
	
	fun join(param: User): Int {
		userRepository.save(param)
		return 1;
	}
	
	
}