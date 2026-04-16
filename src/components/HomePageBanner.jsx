function HomePageBanner({ bannerImageUrl }) {
    const styles = {
        img: {
            width: '100%',
            height: '90px',
            borderRadius: '10px',
            boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
        }
    }
    
    return (
        <div>
            {bannerImageUrl && (
                <img src={bannerImageUrl} alt="Home Page Banner" style={styles.img} />
            )}
        </div>
    )
}

export default HomePageBanner;
