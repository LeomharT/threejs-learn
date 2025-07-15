import Experience from './src/Experience/Experience';

const experience = Experience.getInstance();

const root = document.querySelector('#root') as HTMLDivElement;
root.append(experience.canvas);
