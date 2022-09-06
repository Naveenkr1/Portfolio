import React from 'react';
import '../../styles/caseStudy.css';
import svg01 from './Svg/01.svg';
import svg02 from './Svg/02.svg';
import svg03 from './Svg/03.svg';
import svg04 from './Svg/04.svg';
import svg05 from './Svg/05.svg';
import svg06 from './Svg/06.svg';
import svg07 from './Svg/07.svg';
import svg08 from './Svg/08.svg';
import Research from './Images/Research.svg';
import Anlysis from './Images/Anlysis.svg';
import Insta_Spotify from './Images/Insta_Spotify.svg';
import Key_Pain_Point from './Images/Key_Pain_Point.svg';
import Flow from './Images/Flow.png';
import Solution_PC from './Images/Solution_PC.png';
import Caption_PC from './Images/Caption_PC.svg';
import Caption_Mobile from './Images/Caption_Mobile.svg';
import Solution_Mobile from './Images/Solution_Mobile.svg';
import Key_Pain_Point_Mobile from './Images/Key_Pain_Point_Mobile.svg';
import Ques from './Images/Ques.svg';
import QuesMobile from './Images/QuesMobile.svg';
import User_Flow from './Images/User_Flow.svg';
import Logo from './Svg/LogoN.svg';
import Mobile from './Svg/mobile.svg';
import Desktop from './Svg/desktop.svg';
import Arrow from './Svg/arrow.svg';

function CaseStudy() {

    const handleClick = () => { }
    return (
        <div>
            <div data-animation="default" data-collapse="tiny" data-duration={400} data-easing="ease-in-sine" data-easing2="ease-out-sine" role="banner" className="navbar w-nav">
                <div style={{ marginTop: 30, marginBottom: 30 }} className="nav-bar">
                    <a href="/" className="navbar-logo">
                        <img id="image-pc" src={Logo} alt="" />
                        <div id="image-pc">Back To Home</div>
                        <img src={Arrow} id="image-mobile" alt="" />
                    </a>
                    <div>
                        <img src={Mobile} id="image-pc" alt="" />
                        <img src={Desktop} id="image-mobile" alt="" />
                    </div>
                </div>
            </div>
            <div className="title-lumos wf-section">
                <div className="content-title-div">
                    <div className="columns-3 w-row">
                        <div className="column-6 w-col w-col-4">
                            <h1 data-w-id="0aafda98-74fd-9e35-60f3-f174bbb3d9ca" style={{ opacity: 1 }} className="heading">Spotify Moments</h1>
                            <div className="text-block-26">UIUX</div>
                            <p data-w-id="0aafda98-74fd-9e35-60f3-f174bbb3d9ce" style={{ opacity: 1 }} className="paragraph-2">Spotify Moments is a new feature that combines listening and social experiences on Spotify App</p>
                        </div>
                        <div className="column-7 w-col w-col-8">
                            <img src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617f1d7905aa1e2a28a3b796_ezgif.com-gif-maker%20(1).gif" loading="lazy" style={{ opacity: 1 }} data-w-id="0aafda98-74fd-9e35-60f3-f174bbb3d9d1" alt="" className="image-36" />
                        </div>
                    </div>
                </div>
                <div className="line-1" />
            </div>
            <div className="section-3 wf-section">
                <div className="columns-4 w-row">
                    <div className="column-8 w-col w-col-6">
                        <div className="w-layout-grid grid-3">
                            <div className="text-block-9">
                                <span className="text-span-5">DATE</span>
                                <br />June 2022 - Aug 2022
                            </div>
                            <div className="text-block-9">
                                <span className="text-span-5">ROLE</span>
                                <br />User Research / UI/UX Design
                            </div>
                            <div className="text-block-9">
                                <span className="text-span-5">Tools</span>
                                <br />Figma, Miro, Notion
                            </div>
                        </div>
                    </div>
                    <div className="column-9 w-col w-col-6">
                        <div className="text-block-10">Spotify’s mission is to help people listen to music whenever and wherever they want and it aims to provide an easy way to find the right music or podcast for every moment. However, while Spotify does a great job at bringing people together through music, it also keeps them apart. Spotify has an existing feature on its desktop version called Friends Activity, which enables users to connect with Facebook and see friend’s activities, however, the social connection this provides is limited. Currently to share music or podcast on the Spotify app, one needs to go elsewhere. Users need to use other apps like WhatsApp or Instagram to connect and share music with others.</div>
                    </div>
                </div>
                <div className="columns-4 w-row">
                    <div className="column-8 w-col w-col-6">
                        <h3 className="heading-2">
                            <img src={svg01} alt="" />
                            {/* <span class="text-span-7">Challenge</span>‍ */}
                        </h3>
                    </div>
                    <div className="column-9 w-col w-col-6">
                        <div className="right-text">How might we create a feature that helps Spotify keep their listeners captivated with the Spotify platform that they encourage their friends to join, connect, and share?</div>
                    </div>
                </div>
                <div className="chapter w-row">
                    <div className="column-8 w-col w-col-6">
                        <h3 className="heading-2">
                            <img src={svg02} alt="" />

                        </h3>
                    </div>
                    <div className="column-9 w-col w-col-6">
                        <div className="right-text">To add a new feature connecting people on Spotify, we analyzed Spotify's current social features and its usability to better understand what is lacked and how we can improve this experience.</div>
                    </div>
                </div>
                <div className="div-block-5 social">
                    <img src={Research} sizes="100vw" alt="" className="image-29" />
                </div>
                <div className="columns-5 w-row">
                    <div className="column-8 w-col w-col-6" />
                </div>
                <div className="right-box w-col w-col-64">
                    <div className="div-block-5 social">
                        <img src={Anlysis} loading="lazy" sizes="100vw" alt="" className="image-29" />
                    </div>
                    {/* <div class="right-text">We analyzed how users share music on Instagram story and found the experience to be struggling and not satisfying when there are multiple actions needed(e.g., users are not able to listen to shared Spotify music directly on Instagram Story).</div> */}
                </div>
                <div className="div-block-5 social">
                    <img src={Insta_Spotify} loading="lazy" alt="" className="image-29" />
                </div>
                <div className="columns-5 w-row">
                    <div className="column-8 w-col w-col-6" />
                </div>
                {/* <div class="image-caption">
                  <img src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/6177565357b46f85698fe8df_Screen%20Shot%202021-10-25%20at%209.11.02%20PM.png" loading="lazy" sizes="(max-width: 479px) 92vw, (max-width: 1919px) 78vw, 60vw" srcset="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/6177565357b46f85698fe8df_Screen%20Shot%202021-10-25%20at%209.11.02%20PM-p-500.png 500w, https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/6177565357b46f85698fe8df_Screen%20Shot%202021-10-25%20at%209.11.02%20PM-p-800.png 800w, https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/6177565357b46f85698fe8df_Screen%20Shot%202021-10-25%20at%209.11.02%20PM-p-1080.png 1080w, https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/6177565357b46f85698fe8df_Screen%20Shot%202021-10-25%20at%209.11.02%20PM-p-1600.png 1600w, https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/6177565357b46f85698fe8df_Screen%20Shot%202021-10-25%20at%209.11.02%20PM-p-2000.png 2000w, https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/6177565357b46f85698fe8df_Screen%20Shot%202021-10-25%20at%209.11.02%20PM-p-2600.png 2600w, https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/6177565357b46f85698fe8df_Screen%20Shot%202021-10-25%20at%209.11.02%20PM-p-3200.png 3200w, https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/6177565357b46f85698fe8df_Screen%20Shot%202021-10-25%20at%209.11.02%20PM.png 3550w" alt="" class="image-4" />
                  <div class="caption">Interview Documentation ↑</div>
              </div> */}
                <div className="div-block-5 social">
                    <h3 className="heading-2">
                        <img src={svg03} alt="" />
                    </h3>
                    <img src={Key_Pain_Point} id="image-pc" loading="lazy" alt="" className="image-30" />
                    <img style={{ width: '100%' }} src={Key_Pain_Point_Mobile} id="image-mobile" loading="lazy" alt="" className="image-30" />
                </div>
                <div className="columns-5 w-row">
                    <div className="column-8 w-col w-col-6" />
                    <div className="div-block-5 social">
                        <img src={Ques} loading="lazy" id='image-pc' alt="" className="image-Ques" />
                        <img src={QuesMobile} loading="lazy" id='image-mobile' alt="" className="image-Ques" />
                    </div>
                    {/* <div class="right-text">We held nine interviews with Parsons students to obtain in-depth qualitative responses regarding the key aspects of their experience with Spotify. <br />
                          <br />Some sample questions are: <br />
                          <span class="text-list">- What do you like about Spotify? <br />- What are some inconveniences when using Spotify? <br />- If you have used other music streaming platforms, how were they compared to Spotify? <br />- Would social features in Spotify enhance/enrich your listening experience? Why? </span>
                          <br />
                      </div> */}
                </div>
                <div className="columns-9 w-row">
                    <div className="column-8 spaceabove w-col w-col-4">
                        <h3 className="heading-2">
                            <img src={svg04} alt="" />‍
                        </h3>
                    </div>
                    <div className="column-9 w-col w-col-8" />
                </div>
                <div className="image-caption">
                    <img src={Caption_PC} id='image-pc' loading="lazy" sizes="(max-width: 479px) 92vw, (max-width: 1919px) 78vw, 60vw" alt="" className="image-4" />
                </div>
                <div className="image-caption">
                    <img src={Caption_Mobile} id='image-mobile' loading="lazy" sizes="(max-width: 479px) 92vw, (max-width: 1919px) 78vw, 60vw" alt="" className="image-4" />
                </div>
                {/* <div className="image-caption">
                    <img src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61b37ebf5e6d50382dc0507f_Instagram%20post%20-%204.jpg" loading="lazy" sizes="(max-width: 479px) 92vw, (max-width: 1919px) 78vw, 60vw" srcSet="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61b37ebf5e6d50382dc0507f_Instagram%20post%20-%204-p-500.jpeg 500w, https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61b37ebf5e6d50382dc0507f_Instagram%20post%20-%204-p-800.jpeg 800w, https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61b37ebf5e6d50382dc0507f_Instagram%20post%20-%204-p-1080.jpeg 1080w, https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61b37ebf5e6d50382dc0507f_Instagram%20post%20-%204-p-1600.jpeg 1600w, https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61b37ebf5e6d50382dc0507f_Instagram%20post%20-%204-p-2000.jpeg 2000w, https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61b37ebf5e6d50382dc0507f_Instagram%20post%20-%204-p-2600.jpeg 2600w, https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61b37ebf5e6d50382dc0507f_Instagram%20post%20-%204-p-3200.jpeg 3200w, https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61b37ebf5e6d50382dc0507f_Instagram%20post%20-%204.jpg 4218w" alt="" className="image-4" />
                </div>
                <div className="div-block-5 social">
                    <img src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61b38125bc584319f0492fc8_Instagram%20post%20-%205.jpg" loading="lazy" sizes="100vw" srcSet="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61b38125bc584319f0492fc8_Instagram%20post%20-%205-p-500.jpeg 500w, https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61b38125bc584319f0492fc8_Instagram%20post%20-%205-p-800.jpeg 800w, https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61b38125bc584319f0492fc8_Instagram%20post%20-%205-p-1080.jpeg 1080w, https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61b38125bc584319f0492fc8_Instagram%20post%20-%205-p-1600.jpeg 1600w, https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61b38125bc584319f0492fc8_Instagram%20post%20-%205-p-2000.jpeg 2000w, https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61b38125bc584319f0492fc8_Instagram%20post%20-%205-p-2600.jpeg 2600w, https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61b38125bc584319f0492fc8_Instagram%20post%20-%205-p-3200.jpeg 3200w, https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61b38125bc584319f0492fc8_Instagram%20post%20-%205.jpg 4218w" alt="" className="image-29" />
                </div> */}
                <div className="columns-4 double w-row">
                    <div className="column-8 w-col w-col-6">
                        <h3 className="heading-2">
                            <img src={svg05} alt="" />‍
                        </h3>
                    </div>
                    <div className="column-9 w-col w-col-6" />
                </div>
                <div data-w-id="87cc062d-1402-911c-9434-77f55b831b58" style={{ opacity: 1 }} className="w-layout-grid grid-8">
                    {/* <img  sizes="(max-width: 479px) 92vw, (max-width: 1919px) 78vw, 60vw" src={Solution_PC} alt="" /> */}
                    <img style={{ width: '100%', height: '100%' }} src={Solution_PC} id='image-pc' alt="" />
                    <img style={{ width: '100%', height: '100%' }} src={Solution_Mobile} id='image-mobile' alt="" />
                </div>
                <div className="columns-4 double w-row">
                    <div className="column-8 spaceabove w-col w-col-4">
                        <h3 className="heading-2">
                            <img src={svg06} alt="" />‍
                        </h3>
                    </div>
                    <div className="column-9 w-col w-col-8" />
                </div>
                <div className="columns-5 w-row">
                    <div className="column-8 w-col w-col-4" />
                    <div className="column-9 w-col w-col-8" />
                </div>
                <div className="image-caption">
                    <img src={User_Flow} loading="lazy" sizes="(max-width: 479px) 92vw, (max-width: 1919px) 78vw, 60vw" alt="" className="image-4" />
                    {/* <img src={User_Flow} loading="lazy" sizes="(max-width: 479px) 92vw, (max-width: 1919px) 78vw, 60vw" alt="" className="image-4" /> */}
                </div>
                <div className="columns-5 w-row">
                    <div className="column-8 w-col w-col-5" />
                    <div className="right-box w-col w-col-7">
                        <div className="right-text only">
                            <span className="text-list">01 –– From homepage, user can access Spotify Moments and like songs, add to queue or playlist. If users like the moment, they can save the moment to the library. </span>
                            <span className="text-list">02 –– Users can create moment in three ways: first, selecting their profile on the home page ; second, highlighting the lyrics when listening to music; third, clicking the three dots menu when playing music and select create moment.</span>
                            <span className="text-list">03 –– When creating moment, users can select from three layouts: album cover, lyrics, or video snippet if available. Users can also add 1-2 sentences to express their thoughts on the music. </span>
                        </div>
                    </div>
                </div>
                <div className="columns-9 w-row">
                    <div className="column-8 spaceabove w-col w-col-11">
                        <h3 className="heading-2">
                            <img src={svg07} alt="" />
                        </h3>
                    </div>
                    <div className="column-9 w-col w-col-1" />
                </div>
                <div className="div-block-4">
                    <img src={Flow} loading="lazy" sizes="(max-width: 479px) 92vw, (max-width: 1919px) 78vw, 60vw" alt="" className="image-4" />
                </div>
                <div className="columns-9 w-row">
                    <div className="column-8 w-col w-col-11" />
                    <div className="column-9 w-col w-col-1" />
                </div>
                <div className="columns-9 w-row">
                    <div className="column-8 spaceabove w-col w-col-11">
                        <h3 className="heading-2">
                            <img src={svg08} alt="" />
                        </h3>
                    </div>
                    <div className="column-9 w-col w-col-1" />
                </div>
                <div data-w-id="fbca73e3-77f7-4191-7c7d-8c7c3093b8b9" style={{ opacity: 1 }} className="columns-20 w-row">
                    <div className="column-39 w-col w-col-6">
                        <div className="div-block-21">
                            <div className="text-block-31">
                                <span className="text-span-21">01</span>
                                <br />Share Liked Music and Thoughts <br />
                                <span className="grey-cap more">Share the music you love to your friends! Spotify Moments enables lyrics sharing, music sharing, and more! <br />
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="column-38 w-col w-col-6">
                        <div data-poster-url="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61bfac9d4873db41d3f975dc_spotify feature 1-poster-00001.jpg" data-video-urls="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61bfac9d4873db41d3f975dc_spotify feature 1-transcode.mp4,https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61bfac9d4873db41d3f975dc_spotify feature 1-transcode.webm" data-autoplay="true" data-loop="true" data-wf-ignore="true" data-beta-bgvideo-upgrade="false" className="background-video-9 w-background-video w-background-video-atom">
                            <video id="fbca73e3-77f7-4191-7c7d-8c7c3093b8c4-video" autoPlay loop style={{ backgroundImage: 'url("https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61bfac9d4873db41d3f975dc_spotify feature 1-poster-00001.jpg")' }} muted playsInline data-wf-ignore="true" data-object-fit="cover">
                                <source src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61bfac9d4873db41d3f975dc_spotify feature 1-transcode.mp4" data-wf-ignore="true" />
                                <source src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61bfac9d4873db41d3f975dc_spotify feature 1-transcode.webm" data-wf-ignore="true" />
                            </video>
                        </div>
                    </div>
                </div>
                <div data-w-id="7956d879-6ef2-424e-cfc2-6eec23754a2f" style={{ opacity: 1 }} className="columns-20 w-row">
                    <div className="column-39 w-col w-col-6">
                        <div className="div-block-21">
                            <div className="text-block-31 no">
                                <span className="text-span-21">02</span>
                                <br />Connect With Friends <br />‍
                            </div>
                        </div>
                        <div data-poster-url="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61bfbe0c45ba8d75c1af473d_spotify feature 2 copy-poster-00001.jpg" data-video-urls="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61bfbe0c45ba8d75c1af473d_spotify feature 2 copy-transcode.mp4,https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61bfbe0c45ba8d75c1af473d_spotify feature 2 copy-transcode.webm" data-autoplay="true" data-loop="true" data-wf-ignore="true" data-beta-bgvideo-upgrade="false" className="background-video-9 w-background-video w-background-video-atom">
                            <video id="d190d39f-9b8d-b027-fa06-25b984e97740-video" autoPlay loop style={{ backgroundImage: 'url("https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61bfbe0c45ba8d75c1af473d_spotify feature 2 copy-poster-00001.jpg")' }} muted playsInline data-wf-ignore="true" data-object-fit="cover">
                                <source src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61bfbe0c45ba8d75c1af473d_spotify feature 2 copy-transcode.mp4" data-wf-ignore="true" />
                                <source src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61bfbe0c45ba8d75c1af473d_spotify feature 2 copy-transcode.webm" data-wf-ignore="true" />
                            </video>
                        </div>
                    </div>
                    <div className="column-38 w-col w-col-6">
                        <div className="div-block-21 no">
                            <div className="text-block-31">
                                <span className="text-span-21">02</span>
                                <br />Connect With Friends <br />
                                <span className="grey-cap more">See what your friends are listening and add to your music list</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div data-w-id="a567e6ad-3e1f-5d5d-2d1a-914c56779216" style={{ opacity: 1 }} className="columns-20 w-row">
                    <div className="column-39 w-col w-col-6">
                        <div className="div-block-21">
                            <div className="text-block-31">
                                <span className="text-span-21">03</span>
                                <br />Collect Moments <br />
                                <span className="grey-cap more">See collected moments in Library and open it whenever you want</span>
                            </div>
                        </div>
                    </div>
                    <div className="column-38 w-col w-col-6">
                        <div data-poster-url="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61bfc0e1981c8f0ee520f76a_spotify feature 3-poster-00001.jpg" data-video-urls="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61bfc0e1981c8f0ee520f76a_spotify feature 3-transcode.mp4,https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61bfc0e1981c8f0ee520f76a_spotify feature 3-transcode.webm" data-autoplay="true" data-loop="true" data-wf-ignore="true" data-beta-bgvideo-upgrade="false" className="background-video-9 w-background-video w-background-video-atom">
                            <video id="a567e6ad-3e1f-5d5d-2d1a-914c56779221-video" autoPlay loop style={{ backgroundImage: 'url("https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61bfc0e1981c8f0ee520f76a_spotify feature 3-poster-00001.jpg")' }} muted playsInline data-wf-ignore="true" data-object-fit="cover">
                                <source src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61bfc0e1981c8f0ee520f76a_spotify feature 3-transcode.mp4" data-wf-ignore="true" />
                                <source src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61bfc0e1981c8f0ee520f76a_spotify feature 3-transcode.webm" data-wf-ignore="true" />
                            </video>
                        </div>
                    </div>
                </div>
                <div className="columns-9 w-row">
                    <div className="column-8 spaceabove w-col w-col-11">
                        <h3 className="heading-2">
                            <span className="text-span-7">Prototest ——</span>‍
                        </h3>
                    </div>
                    <div className="column-9 w-col w-col-1" />
                </div>
                <div className="div-block-12">
                    <div className="columns-11 w-row">
                        <div className="column-15 w-col w-col-3 w-col-medium-6 w-col-small-6 w-col-tiny-tiny-stack">
                            <div data-poster-url="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd4933ba6a0479589cd2d_6b72c169-3759-4ca2-9056-7e2b8143f2e7 (online-video-cuttercom)-poster-00001.jpg" data-video-urls="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd4933ba6a0479589cd2d_6b72c169-3759-4ca2-9056-7e2b8143f2e7 (online-video-cuttercom)-transcode.mp4,https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd4933ba6a0479589cd2d_6b72c169-3759-4ca2-9056-7e2b8143f2e7 (online-video-cuttercom)-transcode.webm" data-autoplay="true" data-loop="true" data-wf-ignore="true" data-beta-bgvideo-upgrade="false" className="background-video-5 w-background-video w-background-video-atom">
                                <video id="cb2340db-34a3-9a3a-ced8-4443bd3aec36-video" autoPlay loop style={{ backgroundImage: 'url("https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd4933ba6a0479589cd2d_6b72c169-3759-4ca2-9056-7e2b8143f2e7 (online-video-cuttercom)-poster-00001.jpg")' }} muted playsInline data-wf-ignore="true" data-object-fit="cover">
                                    <source src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd4933ba6a0479589cd2d_6b72c169-3759-4ca2-9056-7e2b8143f2e7 (online-video-cuttercom)-transcode.mp4" data-wf-ignore="true" />
                                    <source src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd4933ba6a0479589cd2d_6b72c169-3759-4ca2-9056-7e2b8143f2e7 (online-video-cuttercom)-transcode.webm" data-wf-ignore="true" />
                                </video>
                            </div>
                            <div className="div-block-13">
                                <div className="text-block-18">Connect with friends and artists</div>
                            </div>
                        </div>
                        <div className="column-13 w-col w-col-3 w-col-medium-6 w-col-small-6 w-col-tiny-tiny-stack">
                            <div data-poster-url="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd4423ba6a0f98f89cbcb_90449d7c-de12-412a-92ec-57a54741fdb9 (online-video-cuttercom)-poster-00001.jpg" data-video-urls="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd4423ba6a0f98f89cbcb_90449d7c-de12-412a-92ec-57a54741fdb9 (online-video-cuttercom)-transcode.mp4,https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd4423ba6a0f98f89cbcb_90449d7c-de12-412a-92ec-57a54741fdb9 (online-video-cuttercom)-transcode.webm" data-autoplay="true" data-loop="true" data-wf-ignore="true" data-beta-bgvideo-upgrade="false" className="background-video-5 w-background-video w-background-video-atom">
                                <video id="b2c6f7f8-6fb2-17e3-40ac-b85f2d88c880-video" autoPlay loop style={{ backgroundImage: 'url("https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd4423ba6a0f98f89cbcb_90449d7c-de12-412a-92ec-57a54741fdb9 (online-video-cuttercom)-poster-00001.jpg")' }} muted playsInline data-wf-ignore="true" data-object-fit="cover">
                                    <source src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd4423ba6a0f98f89cbcb_90449d7c-de12-412a-92ec-57a54741fdb9 (online-video-cuttercom)-transcode.mp4" data-wf-ignore="true" />
                                    <source src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd4423ba6a0f98f89cbcb_90449d7c-de12-412a-92ec-57a54741fdb9 (online-video-cuttercom)-transcode.webm" data-wf-ignore="true" />
                                </video>
                            </div>
                            <div className="div-block-13">
                                <div className="text-block-18">Share and recommend songs through Spotify Moments</div>
                            </div>
                        </div>
                        <div className="column-13 w-col w-col-3 w-col-medium-6 w-col-small-6 w-col-tiny-tiny-stack">
                            <div data-poster-url="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd54a51b796999532d507_3fe2826c-0cbc-40c1-8f41-9d4cef9bdb99 (online-video-cuttercom)-poster-00001.jpg" data-video-urls="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd54a51b796999532d507_3fe2826c-0cbc-40c1-8f41-9d4cef9bdb99 (online-video-cuttercom)-transcode.mp4,https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd54a51b796999532d507_3fe2826c-0cbc-40c1-8f41-9d4cef9bdb99 (online-video-cuttercom)-transcode.webm" data-autoplay="true" data-loop="true" data-wf-ignore="true" data-beta-bgvideo-upgrade="false" className="background-video-5 w-background-video w-background-video-atom">
                                <video id="39538dae-21c9-c126-d28c-377fe0a6b687-video" autoPlay loop style={{ backgroundImage: 'url("https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd54a51b796999532d507_3fe2826c-0cbc-40c1-8f41-9d4cef9bdb99 (online-video-cuttercom)-poster-00001.jpg")' }} muted playsInline data-wf-ignore="true" data-object-fit="cover">
                                    <source src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd54a51b796999532d507_3fe2826c-0cbc-40c1-8f41-9d4cef9bdb99 (online-video-cuttercom)-transcode.mp4" data-wf-ignore="true" />
                                    <source src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd54a51b796999532d507_3fe2826c-0cbc-40c1-8f41-9d4cef9bdb99 (online-video-cuttercom)-transcode.webm" data-wf-ignore="true" />
                                </video>
                            </div>
                            <div className="div-block-13">
                                <div className="text-block-18">Share lyrics</div>
                            </div>
                        </div>
                        <div className="column-12 w-col w-col-3 w-col-medium-6 w-col-small-6 w-col-tiny-tiny-stack">
                            <div data-poster-url="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd637e6d82b4db4a00ff4_d9477953-0ed4-4768-bb35-d0bcab4ff9a5 (online-video-cuttercom)-poster-00001.jpg" data-video-urls="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd637e6d82b4db4a00ff4_d9477953-0ed4-4768-bb35-d0bcab4ff9a5 (online-video-cuttercom)-transcode.mp4,https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd637e6d82b4db4a00ff4_d9477953-0ed4-4768-bb35-d0bcab4ff9a5 (online-video-cuttercom)-transcode.webm" data-autoplay="true" data-loop="true" data-wf-ignore="true" data-beta-bgvideo-upgrade="false" className="background-video-5 w-background-video w-background-video-atom">
                                <video id="64a0675d-7a51-e85d-13ac-828dbe8d604e-video" autoPlay loop style={{ backgroundImage: 'url("https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd637e6d82b4db4a00ff4_d9477953-0ed4-4768-bb35-d0bcab4ff9a5 (online-video-cuttercom)-poster-00001.jpg")' }} muted playsInline data-wf-ignore="true" data-object-fit="cover">
                                    <source src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd637e6d82b4db4a00ff4_d9477953-0ed4-4768-bb35-d0bcab4ff9a5 (online-video-cuttercom)-transcode.mp4" data-wf-ignore="true" />
                                    <source src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd637e6d82b4db4a00ff4_d9477953-0ed4-4768-bb35-d0bcab4ff9a5 (online-video-cuttercom)-transcode.webm" data-wf-ignore="true" />
                                </video>
                            </div>
                            <div className="div-block-13">
                                <div className="text-block-18">Create your Spotify Moments</div>
                            </div>
                        </div>
                    </div>
                    <div className="columns-11 w-row">
                        <div className="column-15 w-col w-col-3 w-col-tiny-tiny-stack">
                            <div data-poster-url="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd8307296850b0cc21de0_676228eb-c987-4c9d-955c-5471eaf7dabe (online-video-cuttercom)-poster-00001.jpg" data-video-urls="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd8307296850b0cc21de0_676228eb-c987-4c9d-955c-5471eaf7dabe (online-video-cuttercom)-transcode.mp4,https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd8307296850b0cc21de0_676228eb-c987-4c9d-955c-5471eaf7dabe (online-video-cuttercom)-transcode.webm" data-autoplay="true" data-loop="true" data-wf-ignore="true" data-beta-bgvideo-upgrade="false" className="background-video-5 w-background-video w-background-video-atom">
                                <video id="463aa758-e326-8f6c-21c2-c1dcb4143fd3-video" autoPlay loop style={{ backgroundImage: 'url("https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd8307296850b0cc21de0_676228eb-c987-4c9d-955c-5471eaf7dabe (online-video-cuttercom)-poster-00001.jpg")' }} muted playsInline data-wf-ignore="true" data-object-fit="cover">
                                    <source src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd8307296850b0cc21de0_676228eb-c987-4c9d-955c-5471eaf7dabe (online-video-cuttercom)-transcode.mp4" data-wf-ignore="true" />
                                    <source src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd8307296850b0cc21de0_676228eb-c987-4c9d-955c-5471eaf7dabe (online-video-cuttercom)-transcode.webm" data-wf-ignore="true" />
                                </video>
                            </div>
                            <div className="div-block-13">
                                <div className="text-block-18">Decide who you want to share your Spotify Moments with</div>
                            </div>
                        </div>
                        <div className="column-14 w-col w-col-3 w-col-tiny-tiny-stack">
                            <div data-poster-url="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd9453f3604d439e8a6e4_dd300711-1f03-4bdb-8865-2517fdbc6088 (online-video-cuttercom)-poster-00001.jpg" data-video-urls="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd9453f3604d439e8a6e4_dd300711-1f03-4bdb-8865-2517fdbc6088 (online-video-cuttercom)-transcode.mp4,https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd9453f3604d439e8a6e4_dd300711-1f03-4bdb-8865-2517fdbc6088 (online-video-cuttercom)-transcode.webm" data-autoplay="true" data-loop="true" data-wf-ignore="true" data-beta-bgvideo-upgrade="false" className="background-video-5 w-background-video w-background-video-atom">
                                <video id="463aa758-e326-8f6c-21c2-c1dcb4143fd5-video" autoPlay loop style={{ backgroundImage: 'url("https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd9453f3604d439e8a6e4_dd300711-1f03-4bdb-8865-2517fdbc6088 (online-video-cuttercom)-poster-00001.jpg")' }} muted playsInline data-wf-ignore="true" data-object-fit="cover">
                                    <source src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd9453f3604d439e8a6e4_dd300711-1f03-4bdb-8865-2517fdbc6088 (online-video-cuttercom)-transcode.mp4" data-wf-ignore="true" />
                                    <source src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dd9453f3604d439e8a6e4_dd300711-1f03-4bdb-8865-2517fdbc6088 (online-video-cuttercom)-transcode.webm" data-wf-ignore="true" />
                                </video>
                            </div>
                            <div className="div-block-13">
                                <div className="text-block-18">View your posted Spotify Moments</div>
                            </div>
                        </div>
                        <div className="column-13 w-col w-col-3 w-col-tiny-tiny-stack">
                            <div data-poster-url="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dda2f143e5d4f18dcebbb_065be9ce-6c22-4532-9177-24c636685402 (online-video-cuttercom)-poster-00001.jpg" data-video-urls="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dda2f143e5d4f18dcebbb_065be9ce-6c22-4532-9177-24c636685402 (online-video-cuttercom)-transcode.mp4,https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dda2f143e5d4f18dcebbb_065be9ce-6c22-4532-9177-24c636685402 (online-video-cuttercom)-transcode.webm" data-autoplay="true" data-loop="true" data-wf-ignore="true" data-beta-bgvideo-upgrade="false" className="background-video-5 w-background-video w-background-video-atom">
                                <video id="463aa758-e326-8f6c-21c2-c1dcb4143fd7-video" autoPlay loop style={{ backgroundImage: 'url("https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dda2f143e5d4f18dcebbb_065be9ce-6c22-4532-9177-24c636685402 (online-video-cuttercom)-poster-00001.jpg")' }} muted playsInline data-wf-ignore="true" data-object-fit="cover">
                                    <source src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dda2f143e5d4f18dcebbb_065be9ce-6c22-4532-9177-24c636685402 (online-video-cuttercom)-transcode.mp4" data-wf-ignore="true" />
                                    <source src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617dda2f143e5d4f18dcebbb_065be9ce-6c22-4532-9177-24c636685402 (online-video-cuttercom)-transcode.webm" data-wf-ignore="true" />
                                </video>
                            </div>
                            <div className="div-block-13">
                                <div className="text-block-18">Collect the moments you love</div>
                            </div>
                        </div>
                        <div className="column-12 w-col w-col-3 w-col-tiny-tiny-stack">
                            <div data-poster-url="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617ddb67274902e8741366c0_fe11c32d-ae5e-49dd-92a0-adc22761955d (online-video-cuttercom)-poster-00001.jpg" data-video-urls="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617ddb67274902e8741366c0_fe11c32d-ae5e-49dd-92a0-adc22761955d (online-video-cuttercom)-transcode.mp4,https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617ddb67274902e8741366c0_fe11c32d-ae5e-49dd-92a0-adc22761955d (online-video-cuttercom)-transcode.webm" data-autoplay="true" data-loop="true" data-wf-ignore="true" data-beta-bgvideo-upgrade="false" className="background-video-5 w-background-video w-background-video-atom">
                                <video id="463aa758-e326-8f6c-21c2-c1dcb4143fd9-video" autoPlay loop style={{ backgroundImage: 'url("https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617ddb67274902e8741366c0_fe11c32d-ae5e-49dd-92a0-adc22761955d (online-video-cuttercom)-poster-00001.jpg")' }} muted playsInline data-wf-ignore="true" data-object-fit="cover">
                                    <source src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617ddb67274902e8741366c0_fe11c32d-ae5e-49dd-92a0-adc22761955d (online-video-cuttercom)-transcode.mp4" data-wf-ignore="true" />
                                    <source src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/617ddb67274902e8741366c0_fe11c32d-ae5e-49dd-92a0-adc22761955d (online-video-cuttercom)-transcode.webm" data-wf-ignore="true" />
                                </video>
                            </div>
                            <div className="div-block-13">
                                <div className="text-block-18">Personalize Spotify home page</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="line-1 big" />
            </div>
            <div className="next wf-section">
                <a href="/see-sound" className="next-section w-inline-block">
                    <div className="next-text-section">
                        <div className="text-block-17">Next Project ——</div>
                    </div>
                    <div className="next-div">
                        <div className="columns-3 next w-row">
                            <div className="column-6 w-col w-col-4">
                                <h1 className="heading">See Sound</h1>
                            </div>
                            <div className="column-7 next spotify w-col w-col-8">
                                <img src="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61da95a53dd133a82e618fce_Artboard%201%402x.png" loading="lazy" sizes="(max-width: 479px) 92vw, (max-width: 767px) 100vw, (max-width: 1919px) 61vw, 53vw" srcSet="https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61da95a53dd133a82e618fce_Artboard%201%402x-p-500.png 500w, https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61da95a53dd133a82e618fce_Artboard%201%402x-p-800.png 800w, https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61da95a53dd133a82e618fce_Artboard%201%402x-p-1080.png 1080w, https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61da95a53dd133a82e618fce_Artboard%201%402x-p-1600.png 1600w, https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61da95a53dd133a82e618fce_Artboard%201%402x-p-2000.png 2000w, https://uploads-ssl.webflow.com/616ba7730d9694e3d4325f7b/61da95a53dd133a82e618fce_Artboard%201%402x.png 3840w" alt="" className="image-6 next spotify" />
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
}

export default CaseStudy;