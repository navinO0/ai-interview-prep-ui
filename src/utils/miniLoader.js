const MiniLoader = ({ text }) => {
    return (
        // <span className="loader"> </span>
        //         <div class="loader">
        //   <div class="loader-text">Loading...</div>
        //   <div class="loader-bar"></div>
        // </div>
        <span className="glitch" data-text="Loading ...">{text || 'Loading ...'}</span>
    );
}

export default MiniLoader