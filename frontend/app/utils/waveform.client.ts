export async function generateWaveformData(audioUrl: string): Promise<number[]> {
  const response = await fetch(audioUrl);
  const arrayBuffer = await response.arrayBuffer();
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  const rawData = audioBuffer.getChannelData(0);
  const samples = 100;
  const blockSize = Math.floor(rawData.length / samples);
  const filteredData = [];
  
  for (let i = 0; i < samples; i++) {
    const blockStart = blockSize * i;
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum += Math.abs(rawData[blockStart + j]);
    }
    filteredData.push(sum / blockSize);
  }
  
  return filteredData;
}
