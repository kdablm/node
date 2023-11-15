class Snowflake {
    constructor(dataCenterId, machineId) {
      // 雪花算法中的一些固定值
      this.epoch = 1609459200000n; // 使用 BigInt 类型
      this.sequenceBits = 12n;
      this.machineBits = 5n;
      this.dataCenterBits = 5n;
  
      // 最大值
      this.maxSequence = (1n << this.sequenceBits) - 1n;
  
      // 左移位数
      this.timestampShift = this.sequenceBits + this.machineBits + this.dataCenterBits;
      this.dataCenterShift = this.sequenceBits + this.machineBits;
      this.machineShift = this.sequenceBits;
  
      // 左移后的掩码
      this.sequenceMask = (1n << this.sequenceBits) - 1n;
  
      // 当前状态
      this.sequence = 0n;
      this.lastTimestamp = -1n;
  
      // 机器ID和数据中心ID
      this.dataCenterId = BigInt(dataCenterId);
      this.machineId = BigInt(machineId);
    }
  
    generateId() {
      let timestamp = this.currentTimestamp();
  
      // 如果当前时间小于上一次生成ID的时间，则发生时钟回退，抛出异常或等待
      if (timestamp < this.lastTimestamp) {
        throw new Error(`Clock moved backwards. Refusing to generate id for ${this.lastTimestamp - timestamp} milliseconds.`);
      }
  
      // 如果是同一毫秒内生成的，则递增序列号
      if (this.lastTimestamp === timestamp) {
        this.sequence = (this.sequence + 1n) & this.sequenceMask;
        if (this.sequence === 0n) {
          timestamp = this.nextTimestamp();
        }
      } else {
        // 不同毫秒内，序列号重置
        this.sequence = 0n;
      }
  
      // 保存当前时间戳
      this.lastTimestamp = timestamp;
  
      // 生成ID
      const id = ((timestamp - this.epoch) << this.timestampShift) |
        (this.dataCenterId << this.dataCenterShift) |
        (this.machineId << this.machineShift) |
        this.sequence;
  
      return id.toString(); // 将 BigInt 转换为字符串
    }
  
    currentTimestamp() {
      return BigInt(this.currentTimestampInMilliseconds());
    }
  
    currentTimestampInMilliseconds() {
      return Date.now();
    }
  
    nextTimestamp() {
      let timestamp = this.currentTimestamp();
      while (timestamp <= this.lastTimestamp) {
        timestamp = this.currentTimestamp();
      }
      return timestamp;
    }
  }
  
  module.exports=Snowflake;
  