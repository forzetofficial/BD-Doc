import { useState, useEffect } from "react";
import styles from "./LoadingScreen.module.css";
import AppBackground from "./AppBackground";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [stepFade, setStepFade] = useState(true);

  const steps = [
    "Подключение к серверу...",
    "Проверка соединения...",
    "Загрузка данных пользователя...",
    "Проверка авторизации...",
    "Синхронизация с базой данных...",
    "Инициализация интерфейса...",
    "Загрузка компонентов...",
    "Готово!"
  ];

  useEffect(() => {
    const duration = 4500;
    const interval = 50;
    const totalSteps = 100;
    const stepDuration = duration / totalSteps;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setFadeOut(true);
          setTimeout(onComplete, 600);
          return 100;
        }
        return prev + (100 / totalSteps);
      });
    }, stepDuration);

    const stepTimer = setInterval(() => {
      setStepFade(false);
      setTimeout(() => {
        setCurrentStep(prev => {
          const newStep = Math.floor((progress / 100) * steps.length);
          return Math.min(newStep, steps.length - 1);
        });
        setStepFade(true);
      }, 200);
    }, 400);

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
    };
  }, [onComplete, progress, steps.length]);

  return (
    <div className={styles.loadingContainer + (fadeOut ? ' ' + styles.fadeOut : '')}>
      <AppBackground />
      <div className={styles.loadingContent}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <div className={styles.logoInner}>
              <span className={styles.logoText}>BD</span>
            </div>
            <div className={styles.logoRing}></div>
            <div className={styles.logoRing2}></div>
          </div>
        </div>

        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className={styles.progressText}>{Math.round(progress)}%</div>
        </div>

        <div className={styles.stepContainer}>
          <div className={styles.stepText + (stepFade ? ' ' + styles.stepTextFade : '')}>{steps[currentStep]}</div>
          <div className={styles.stepDots}>
            {steps.map((_, index) => (
              <div 
                key={index}
                className={`${styles.dot} ${index <= currentStep ? styles.active : ''}`}
              />
            ))}
          </div>
        </div>

        <div className={styles.particles}>
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className={styles.particle}
              style={{
                animationDelay: `${i * 0.1}s`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
