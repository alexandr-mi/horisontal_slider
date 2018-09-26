// import $ from 'jquery';
import './components/Preloader';
import './components/Navigation';
import MiSlider from './components/MiSlider';


let miSlider = new MiSlider('.content', {
  animation_duration: '1.5',
  arrows: true,
  dotes: true
});
