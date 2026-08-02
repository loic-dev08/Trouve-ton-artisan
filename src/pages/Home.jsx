import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProCard from "../components/ProCard";
import StarRating from "../components/StarRating";
import api from "../api/api";
import styles from "../styles/Home.module.css";