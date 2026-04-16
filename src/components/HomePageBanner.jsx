function HomePageBanner({ bannerImageUrl, sliderUrl }) {
    const styles = {
        img: {
            width: '100%',
            height: '90px',
            borderRadius: '10px',
            boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
        }
    }
    
    return (
        <div className="mb-3">
            <a href={sliderUrl}>
                <img src={bannerImageUrl} alt="Home Page Banner" style={styles.img} />
            </a>
        </div>
    )
}

export default HomePageBanner;
