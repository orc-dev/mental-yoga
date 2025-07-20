



function TopMenu() {
    const styles = {
        box: {
            fontSize: '18px',
            //fontWeight: '600',
            //fontFamily: "'Ruslan Display', cursive",
            //fontFamily: "'Bahiana', cursive",
            fontFamily: "'Bungee', sans-serif",
            fontFamily: "'Croissant One', cursive",
            color: 'rgb(255, 255, 255)',
            marginLeft: '20px',
            userSelect: 'none',
        },
    };
    return (
        <div style={styles.box}>
            <div>Mental Yoga</div>
        </div>
    );
}

export default TopMenu;