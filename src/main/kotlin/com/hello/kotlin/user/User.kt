package com.hello.kotlin.user

import javax.persistence.Entity
import javax.persistence.Id

@Entity
data class User(
	
	@Id
	val userEmail: String?,
	val userPw: String?,
	val userName: String?

) {
	constructor() : this(null, null, null);
}