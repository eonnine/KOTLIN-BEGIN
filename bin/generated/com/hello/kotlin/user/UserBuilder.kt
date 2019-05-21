package com.hello.kotlin.user

import lombok.AccessLevel
import lombok.Getter
import lombok.NoArgsConstructor
import javax.persistence.Entity
import javax.persistence.Id

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
data class UserBuilder(
	
	@Id
	val userEmail: String?,
	val userPw: String?,
	val userName: String?

)	{
	
	private constructor(builder: Builder) :
			this(
				builder.userEmail,
				builder.userPw,
				builder.userName
			)
	
	class Builder {
				
		var userEmail: String? = null
				private set
		
		var userPw: String? = null
				private set
		
		var userName: String? = null
				private set
		
		fun userEmail(userEmail: String) = apply { this.userEmail = userEmail }
		fun userPw(userPw: String) = apply { this.userPw = userPw }
		fun userName(userName: String) = apply { this.userName = userName }
		
	}
	
}