package com.hello.kotlin.user

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.test.web.client.getForEntity
import org.springframework.http.HttpStatus
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserTest(@Autowired val restTemplate: TestRestTemplate) {
	
	@BeforeAll
	fun setup() {
		println(">>User Setup")
	}
	
	@Test
	fun `move to Register`(){
		val entity = restTemplate.getForEntity<String>("/user/register")
		System.out.println(entity);
		assertThat(entity.statusCode).isEqualTo(HttpStatus.OK);
	}
	
	
	@AfterAll
	fun teardown() {
		println(">>User Tear down")
	}
}