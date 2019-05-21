package com.hello.kotlin.user

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport

interface UserRepositoryCustom {
	
	fun findAll(): List<User>
	
	fun findByUserEmail(id: String): User
	
	fun save(param: User): Int
	
}

interface UserRepository : JpaRepository<User, Any>, UserRepositoryCustom

class UserRepositoryImpl:  QuerydslRepositorySupport(User::class.java),UserRepositoryCustom {
	
	override fun findAll(): List<User>{
		var result: List<User> = ArrayList<User>();
		val table = QUser.user;
		return result;
	}
	
	override fun findByUserEmail(id: String): User{
		var result: User = User();
		return result;
		
	}
	
	override fun save(param: User): Int{
		var result: Int = 0;
		return result;
	}
	
	
}