export function getDayOrNightIcon(iconName: string, dateTimeString: string): 
    string {

    const hours = new Date(dateTimeString).getHours(); // Extract hours from the dateTimeString
    const isDayTime = hours >= 6 && hours < 18; // Assuming day time is between 6 AM and 6 PM
    
    return isDayTime ? iconName.replace(/.$/, 'd') : iconName.replace(/.$/, 'n');
}