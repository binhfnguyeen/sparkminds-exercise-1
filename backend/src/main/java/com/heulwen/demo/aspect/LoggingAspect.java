package com.heulwen.demo.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    @Pointcut("within(com.heulwen.demo.controller..*)")
    public void controllerPointcut(){}

    @Around("controllerPointcut()")
    public Object arround(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();

        log.info("[REQUEST] {}.{}() - Tham số: {}", className, methodName, Arrays.toString(args));

        try {
            Object result = joinPoint.proceed();

            long elapsedTime = System.currentTimeMillis() - start;
            log.info("[RESPONSE] {}.{}() - Thời gian: {}ms - Kết quả: {}", className, methodName, elapsedTime, result);

            return result;
        } catch (IllegalArgumentException e) {
            log.error("[LỖI PARAM] {}.{}() - Message: {}", className, methodName, e.getMessage());
            throw e;
        } catch (Throwable e) {
            log.error("[EXCEPTION] {}.{}() - Message: {}", className, methodName, e.getMessage());
            throw e;
        }
    }
}
