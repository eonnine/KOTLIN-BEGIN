package com.hello.kotlin

import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.boot.runApplication
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration

//@SpringBootApplication
@Configuration
@EnableAutoConfiguration
@ComponentScan("com.hello.kotlin")
open class KotlinApplication

fun main(args: Array<String>) {
	runApplication<KotlinApplication>(*args)
}
