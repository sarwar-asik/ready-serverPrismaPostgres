
import compression, { CompressionOptions } from 'compression';
import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';


//!  compressor
export const compressionOptions:CompressionOptions = {
  threshold: 2048, //! Only compress responses larger than 1KB
  filter: function (req:Request|any, res:Response|any) {
    if (req.headers['x-no-compression']) {
      // Don't compress responses if this request header is present
      return false;
    }
    // Use the default filter function from compression
    return compression.filter(req, res);
  },
} ;
  

  // ! express-rate-limit
type HitCountData= {
    count: number;
    firstHit: Date| string;
    lastHit: Date;
    pathCounts: { [path: string]: number };
  }
  
  const hitCounts: Record<string, HitCountData> = {};
  export const limiterRate = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
      statusCode: 429,
      error: 'Too Many Requests',
      message: 'You have exceeded the allowed number of requests. Please try again later.',
    },
    skip: (req: any) => {
      const trustedIPs = ['192.168.12.31','192.168.12.37','']; 
      return trustedIPs.includes(req.ip);
    },
    keyGenerator: (req: any) => {
      const ip = req.ip;
      const path = req.path;
      const now = new Date();
  
      if (!hitCounts[ip]) {
        hitCounts[ip] = {
          count: 1,
          firstHit:now,
          lastHit: now,
          pathCounts: { [path]: 1 }
        };
      } else {
        hitCounts[ip].count++;
        hitCounts[ip].lastHit = now;
        hitCounts[ip].pathCounts[path] = (hitCounts[ip].pathCounts[path] || 0) + 1;
      }
      
      // eslint-disable-next-line no-console
      console.log(
        `from ${ip} | Total: ${hitCounts[ip].count} | First: ${hitCounts[ip].firstHit.toLocaleString()} | Last: ${hitCounts[ip].lastHit.toLocaleTimeString()} on ${hitCounts[ip].pathCounts[path]} on ${path} | ${hitCounts[ip].pathCounts[path]}`.grey
      );
      return ip;
    },
    
  
  });