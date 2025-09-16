import React from 'react';
import Banner from '../../Components/Banner/Banner';
import Tags from '../../Components/Tags/Tags';
import Announcements from '../../Components/Announcements/Announcements';
import AllPosts from '../../Components/AllPosts/AllPosts';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <Tags></Tags>
            <Announcements></Announcements>
            <AllPosts></AllPosts>
        </div>
    );
};

export default Home;